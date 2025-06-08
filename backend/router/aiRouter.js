// backend/router/aiRouter.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

// Simple non-streaming chat (TEST THIS FIRST)
router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }

    console.log("Sending request to Ollama...");
    console.log("URL:", `${OLLAMA_BASE_URL}/api/generate`);
    console.log("Model:", OLLAMA_MODEL);

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false, // Start with non-streaming to test connection
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("Ollama API Error:", errorText);
      return res
        .status(500)
        .json({ error: "Ollama API Error", details: errorText });
    }

    const result = await ollamaResponse.json();
    console.log("Response received from Ollama");

    res.json({ response: result.response });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Chat failed", details: err.message });
  }
});

// Streaming version using node-fetch correctly
router.post("/chat-stream", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: true,
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("Ollama API Error:", errorText);
      return res
        .status(500)
        .json({ error: "Ollama API Error", details: errorText });
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // node-fetch returns a Node.js readable stream
    ollamaResponse.body.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      const lines = chunkStr.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            res.write(parsed.response);
          }
          if (parsed.done) {
            res.end();
            return;
          }
        } catch (parseErr) {
          console.warn("Failed to parse JSON line:", line);
        }
      }
    });

    ollamaResponse.body.on("end", () => {
      if (!res.headersSent) {
        res.end();
      }
    });

    ollamaResponse.body.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Stream error", details: err.message });
      }
    });
  } catch (err) {
    console.error("Streaming Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Streaming failed", details: err.message });
    }
  }
});

// Simple medical analysis (non-streaming)
router.post("/analyze", async (req, res) => {
  try {
    const { medicalData } = req.body;

    if (!medicalData) {
      return res.status(400).json({ error: "medicalData is required" });
    }

    const aiAnalysisPrompt = `Analyze the following medical data: ${medicalData}`;

    console.log("Analyzing medical data...");

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: aiAnalysisPrompt,
        stream: false, // Non-streaming for reliability
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("Ollama API Error:", errorText);
      return res
        .status(500)
        .json({ error: "Ollama API Error", details: errorText });
    }

    const result = await ollamaResponse.json();
    console.log("Analysis completed");

    res.json({ analysis: result.response });
  } catch (err) {
    console.error("Analysis Error:", err);
    res.status(500).json({ error: "Analysis failed", details: err.message });
  }
});

// Streaming medical analysis
router.post("/analyze-stream", async (req, res) => {
  try {
    const { medicalData } = req.body;

    if (!medicalData) {
      return res.status(400).json({ error: "medicalData is required" });
    }

    const aiAnalysisPrompt = `Analyze the following medical data: ${medicalData}`;

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: aiAnalysisPrompt,
        stream: true,
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("Ollama API Error:", errorText);
      return res
        .status(500)
        .json({ error: "Ollama API Error", details: errorText });
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Handle streaming response
    ollamaResponse.body.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      const lines = chunkStr.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            res.write(parsed.response);
          }
          if (parsed.done) {
            res.end();
            return;
          }
        } catch (parseErr) {
          console.warn("Failed to parse chunk:", line);
        }
      }
    });

    ollamaResponse.body.on("end", () => {
      if (!res.headersSent) {
        res.end();
      }
    });

    ollamaResponse.body.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Stream error", details: err.message });
      }
    });
  } catch (err) {
    console.error("Analysis Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Analysis failed", details: err.message });
    }
  }
});

// Debug route to test Ollama connection
router.get("/test-ollama", async (req, res) => {
  try {
    console.log("Testing Ollama connection...");
    console.log("OLLAMA_BASE_URL:", OLLAMA_BASE_URL);
    console.log("OLLAMA_MODEL:", OLLAMA_MODEL);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({
      status: "Ollama connection successful",
      models: data.models,
      baseUrl: OLLAMA_BASE_URL,
      selectedModel: OLLAMA_MODEL,
    });
  } catch (err) {
    console.error("Ollama connection test failed:", err);
    res.status(500).json({
      error: "Ollama connection failed",
      details: err.message,
      baseUrl: OLLAMA_BASE_URL,
    });
  }
});

export default router;
