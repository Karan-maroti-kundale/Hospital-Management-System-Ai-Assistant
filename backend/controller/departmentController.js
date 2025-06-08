import { Department } from "../models/departmentSchema.js";
import { User } from "../models/userSchema.js";

// Create new department
export const createDepartment = async (req, res) => {
  try {
    const { name, description, head } = req.body;

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department already exists"
      });
    }

    // Create new department
    const department = await Department.create({
      name,
      description,
      head
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department
    });
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create department"
    });
  }
};

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("head", "firstName lastName email");

    res.status(200).json({
      success: true,
      departments
    });
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments"
    });
  }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate("head", "firstName lastName email");

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    res.status(200).json({
      success: true,
      department
    });
  } catch (error) {
    console.error("Get department error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch department"
    });
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  try {
    const { name, description, head } = req.body;
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    // Update fields
    department.name = name || department.name;
    department.description = description || department.description;
    department.head = head || department.head;

    await department.save();

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department
    });
  } catch (error) {
    console.error("Update department error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update department"
    });
  }
};

// Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    // Check if department has doctors
    const doctorsCount = await User.countDocuments({ department: department._id });
    if (doctorsCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete department with assigned doctors"
      });
    }

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: "Department deleted successfully"
    });
  } catch (error) {
    console.error("Delete department error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete department"
    });
  }
};

// Get doctors by department
export const getDoctorsByDepartment = async (req, res) => {
  try {
    const doctors = await User.find({ 
      department: req.params.departmentId,
      role: "Doctor"
    }).select("-password");

    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error("Get doctors by department error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors"
    });
  }
}; 