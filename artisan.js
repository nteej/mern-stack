#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {program} from 'commander';

// Initialize CLI
program
  .version('1.0.0')
  .description('MERN Stack Artisan CLI Tool');

// Helper function to create directories if they don't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Generate Model template
function generateModel(name) {
  const template = `const mongoose = require('mongoose');

const ${name}Schema = new mongoose.Schema({
  // Define your schema fields here
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('${name}', ${name}Schema);`;

  const modelPath = path.join(process.cwd(), 'src', 'models', `${name}.model.js`);
  ensureDirectoryExists(path.dirname(modelPath));
  fs.writeFileSync(modelPath, template);
  console.log(`Model created: ${modelPath}`);
}

// Generate Controller template
function generateController(name) {
  const template = `class ${name}Controller {
  async index(req, res) {
    try {
      const items = await ${name}.find();
      res.json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async store(req, res) {
    try {
      const item = await ${name}.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async show(req, res) {
    try {
      const item = await ${name}.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, error: 'Not found' });
      }
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      const item = await ${name}.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!item) {
        return res.status(404).json({ success: false, error: 'Not found' });
      }
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      const item = await ${name}.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, error: 'Not found' });
      }
      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ${name}Controller();`;

  const controllerPath = path.join(process.cwd(), 'src', 'controllers', `${name}.controller.js`);
  ensureDirectoryExists(path.dirname(controllerPath));
  fs.writeFileSync(controllerPath, template);
  console.log(`Controller created: ${controllerPath}`);
}

// Generate API Routes template
function generateApiRoutes(name) {
  const template = `const express = require('express');
const router = express.Router();
const ${name}Controller = require('../controllers/${name}.controller');

router.get('/${name.toLowerCase()}s', ${name}Controller.index);
router.post('/${name.toLowerCase()}s', ${name}Controller.store);
router.get('/${name.toLowerCase()}s/:id', ${name}Controller.show);
router.put('/${name.toLowerCase()}s/:id', ${name}Controller.update);
router.delete('/${name.toLowerCase()}s/:id', ${name}Controller.destroy);

module.exports = router;`;

  const routePath = path.join(process.cwd(), 'src', 'routes', 'api', `${name}.routes.js`);
  ensureDirectoryExists(path.dirname(routePath));
  fs.writeFileSync(routePath, template);
  console.log(`API Routes created: ${routePath}`);
}

// Generate Web Routes template
function generateWebRoutes(name) {
  const template = `const express = require('express');
const router = express.Router();
const path = require('path');

// Serve React app
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

module.exports = router;`;

  const routePath = path.join(process.cwd(), 'src', 'routes', 'web', `${name}.routes.js`);
  ensureDirectoryExists(path.dirname(routePath));
  fs.writeFileSync(routePath, template);
  console.log(`Web Routes created: ${routePath}`);
}

// Generate Schema template
function generateSchema(name, fields) {
  const schemaFields = fields.reduce((acc, field) => {
    const [fieldName, fieldType] = field.split(':');
    acc[fieldName] = getSchemaType(fieldType);
    return acc;
  }, {});

  const template = `const mongoose = require('mongoose');

const ${name}Schema = new mongoose.Schema({
  ${Object.entries(schemaFields).map(([key, value]) => `${key}: ${value}`).join(',\n  ')},
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('${name}', ${name}Schema);`;

  const schemaPath = path.join(process.cwd(), 'src', 'models', `${name}.model.js`);
  ensureDirectoryExists(path.dirname(schemaPath));
  fs.writeFileSync(schemaPath, template);
  console.log(`Schema created: ${schemaPath}`);
}

// Helper function to get MongoDB schema type
function getSchemaType(type) {
  const types = {
    string: 'String',
    number: 'Number',
    date: 'Date',
    boolean: 'Boolean',
    array: '[]',
    object: 'Object'
  };
  return `{ type: ${types[type.toLowerCase()] || 'String'} }`;
}

// CLI Commands
program
  .command('make:model <name>')
  .description('Generate a new model')
  .action(generateModel);

program
  .command('make:controller <name>')
  .description('Generate a new controller')
  .action(generateController);

program
  .command('make:api-routes <name>')
  .description('Generate API routes')
  .action(generateApiRoutes);

program
  .command('make:web-routes <name>')
  .description('Generate web routes')
  .action(generateWebRoutes);

program
  .command('make:schema <name> [fields...]')
  .description('Generate a schema with fields (e.g., name:string age:number)')
  .action(generateSchema);

program
  .command('make:resource <name>')
  .description('Generate a complete resource (model, controller, routes)')
  .action((name) => {
    generateModel(name);
    generateController(name);
    generateApiRoutes(name);
    generateWebRoutes(name);
  });

program.parse(process.argv);