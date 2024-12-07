const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

//routes/doctorRoutes.js
// app.use('/doctors', doctorRoutes);

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: API for managing doctors
 */

/**
 * @swagger
 * /doctors:
 *   post:
 *     tags:
 *       - Doctors
 *     summary: Add a new doctor
 *     description: Create a new doctor with name, specialization, and phone.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dr. John Doe"
 *               specialization:
 *                 type: string
 *                 example: "Cardiology"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: Doctor added successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', doctorController.addDoctor);

/**
 * @swagger
 * /doctors:
 *   get:
 *     tags:
 *       - Doctors
 *     summary: Get all doctors
 *     description: Retrieve a list of all doctors.
 *     responses:
 *       200:
 *         description: List of doctors
 *       500:
 *         description: Internal server error
 */
router.get('/', doctorController.getDoctors);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     tags:
 *       - Doctors
 *     summary: Get a doctor by ID
 *     description: Retrieve details of a specific doctor by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor
 *     responses:
 *       200:
 *         description: Doctor details
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', doctorController.getDoctor);

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     tags:
 *       - Doctors
 *     summary: Update a doctor
 *     description: Modify details of a specific doctor by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', doctorController.updateDoctor);

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     tags:
 *       - Doctors
 *     summary: Delete a doctor
 *     description: Remove a doctor by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', doctorController.deleteDoctor);


router.get('/:doctorId/clinics', doctorController.listClinicsByDoctor);


module.exports = router;
