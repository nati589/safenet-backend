const Flow = require("../models/flow.model");

const getFlows = async (req, res) => {
  try {
    const flows = await Flow.find({});
    res.status(200).json(flows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneFlow = async (req, res) => {
  try {
    const flow = await Flow.findById(req.params.id);
    res.status(200).json(flow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFlow = async (req, res) => {
    try {
        const flow = await Flow.create(req.body);
        res.status(200).json(flow);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

module.exports = {
  getFlows,
  getOneFlow,
  createFlow
};
