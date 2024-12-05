const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

/**
 * @swagger
 * /medicine:
 *   get:
 *     summary: Get a list of all medicines
 *     description: Retrieve all medicines stored in the system.
 *     responses:
 *       200:
 *         description: A list of medicines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Paracetamol"
 *                   description:
 *                     type: string
 *                     example: "Pain reliever and fever reducer"
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 15.5
 *                   stock:
 *                     type: integer
 *                     example: 100
 */
router.get('/', medicineController.getAll);

/**
 * @swagger
 * /medicine:
 *   post:
 *     summary: Add a new medicine
 *     description: Create a new medicine entry in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ibuprofen"
 *               description:
 *                 type: string
 *                 example: "Used to treat pain, fever, and inflammation"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 25.0
 *               stock:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Medicine successfully added
 */
router.post('/', medicineController.add);

/**
 * @swagger
 * /medicine/{id}:
 *   put:
 *     summary: Update a medicine
 *     description: Update details of a medicine by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the medicine to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ibuprofen"
 *               description:
 *                 type: string
 *                 example: "Used to treat pain, fever, and inflammation"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 20.0
 *               stock:
 *                 type: integer
 *                 example: 60
 *     responses:
 *       200:
 *         description: Medicine successfully updated
 */
router.put('/:id', medicineController.update);

/**
 * @swagger
 * /medicine/{id}:
 *   delete:
 *     summary: Delete a medicine
 *     description: Remove a medicine from the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the medicine to delete
 *     responses:
 *       200:
 *         description: Medicine successfully deleted
 */
router.delete('/:id', medicineController.delete);

module.exports = router;
