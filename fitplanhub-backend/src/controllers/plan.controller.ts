// Plan controller
import { Request, Response } from "express";
import { Plan } from "../models/Plan.model";

export const createPlan = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "trainer") {
      return res.status(403).json({ message: "Trainer only" });
    }

    const planData = {
      ...req.body,
      trainerId: req.user.userId,
    };

    const plan = await Plan.create(planData);
    res.status(201).json({ message: "Plan created", plan });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      difficultyLevel,
      minPrice,
      maxPrice,
      search,
      trainerId,
    } = req.query;

    const query: any = { isActive: true };

    if (category) query.category = category;
    if (difficultyLevel) query.difficultyLevel = difficultyLevel;
    if (trainerId) query.trainerId = trainerId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search as string, "i")] } },
      ];
    }

    const plans = await Plan.find(query)
      .populate("trainerId", "name avatarUrl bio specializations")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Plan.countDocuments(query);

    res.json({
      plans,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id).populate(
      "trainerId",
      "name avatarUrl bio certifications experience specializations"
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ plan });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan || plan.trainerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ message: "Plan updated", plan: updatedPlan });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan || plan.trainerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Plan.findByIdAndDelete(id);
    res.json({ message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyPlans = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const plans = await Plan.find({ trainerId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
