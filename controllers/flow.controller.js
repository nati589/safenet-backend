const Flow = require("../models/flow.model");

const getFlows = async (req, res) => {
  try {
    const flows = await Flow.find({ user: req.user._id }).sort({ _id: -1 });
    // const flows = await Flow.find({});
    res.status(200).json(flows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardFlows = async (req, res) => {
  try {


    const flows = await Flow.find({ user: req.user._id })
      .sort({ _id: -1 })
      .limit(10);
    // const flows = await Flow.find({});
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
  const flow = {
    source_ip: req.body.Flow.source_ip,
    destination_ip: req.body.Flow.destination_ip,
    protocol: req.body.Flow.protocol,
    source_port: req.body.Flow.source_port,
    destination_port: req.body.Flow.destination_port,
    flags: req.body.Flow.flags,
    timestamp: req.body.Flow.timestamp,
    packet_dir: req.body.Flow.packet_dir,
    packet_ihl: req.body.Flow.packet_ihl,
    packet_seg: req.body.Flow.packet_seg,
    Attack_type: req.body.Attack_type,
    Mechanism: req.body.Mechanism,
    user: req.user._id,
  };
  try {
    await Flow.create(flow);
    console.log(req.body);
    // res.status(200).json(flow);
    res.status(200).json({ message: "Flow created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFlows,
  getDashboardFlows,
  getOneFlow,
  createFlow,
};
