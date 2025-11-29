const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');

// Get all branches
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    console.log(`   [SUCCESS] Found ${branches.length} branches`);
    
    // Format response to match frontend expectations (with id field)
    const formattedBranches = branches.map(branch => ({
      id: branch._id.toString(),
      name: branch.name,
      ifsc: branch.ifsc,
      address: branch.address
    }));
    
    res.json(formattedBranches);
  } catch (error) {
    console.error('   [ERROR] Error fetching branches:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Get single branch by ID
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.json({
      id: branch._id.toString(),
      name: branch.name,
      ifsc: branch.ifsc,
      address: branch.address
    });
  } catch (error) {
    console.error('Error fetching branch:', error);
    res.status(500).json({ error: 'Failed to fetch branch' });
  }
});

// Create new branch
router.post('/', async (req, res) => {
  try {
    const { name, ifsc, address } = req.body;

    if (!name || !ifsc || !address) {
      return res.status(400).json({ error: 'Name, IFSC, and address are required' });
    }

    // Check if IFSC already exists
    const existingBranch = await Branch.findOne({ ifsc: ifsc.toUpperCase() });
    if (existingBranch) {
      console.log('   [ERROR] Branch with IFSC already exists');
      return res.status(400).json({ error: 'Branch with this IFSC already exists' });
    }

    const branch = new Branch({
      name: name.trim(),
      ifsc: ifsc.toUpperCase().trim(),
      address: address.trim()
    });

    await branch.save();
    console.log(`   [SUCCESS] Branch created: ${branch.name} (${branch.ifsc})`);

    res.status(201).json({
      id: branch._id.toString(),
      name: branch.name,
      ifsc: branch.ifsc,
      address: branch.address
    });
  } catch (error) {
    console.error('   [ERROR] Error creating branch:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Branch with this IFSC already exists' });
    }
    res.status(500).json({ error: 'Failed to create branch' });
  }
});

// Update branch
router.put('/:id', async (req, res) => {
  try {
    const { name, ifsc, address } = req.body;

    if (!name || !ifsc || !address) {
      return res.status(400).json({ error: 'Name, IFSC, and address are required' });
    }

    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    // Check if IFSC is being changed and if new IFSC already exists
    if (ifsc.toUpperCase() !== branch.ifsc) {
      const existingBranch = await Branch.findOne({ ifsc: ifsc.toUpperCase() });
      if (existingBranch) {
        return res.status(400).json({ error: 'Branch with this IFSC already exists' });
      }
    }

    branch.name = name.trim();
    branch.ifsc = ifsc.toUpperCase().trim();
    branch.address = address.trim();

    await branch.save();
    console.log(`   [SUCCESS] Branch updated: ${branch.name} (${branch.ifsc})`);

    res.json({
      id: branch._id.toString(),
      name: branch.name,
      ifsc: branch.ifsc,
      address: branch.address
    });
  } catch (error) {
    console.error('Error updating branch:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Branch with this IFSC already exists' });
    }
    res.status(500).json({ error: 'Failed to update branch' });
  }
});

// Delete branch
router.delete('/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    console.log(`   [SUCCESS] Branch deleted: ${branch.name} (${branch.ifsc})`);
    res.json({ message: 'Branch deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({ error: 'Failed to delete branch' });
  }
});

module.exports = router;


