const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');

/**
 * @swagger
 * tags:
 *   name: Clinics
 *   description: API for managing clinics
 */

/**
 * @swagger
 * /clinics:
 *   post:
 *     summary: Add a new clinic
 *     tags: [Clinics]
 *     description: Create a new clinic with name, address, phone number, and opening hours.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "City Hospital"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               phoneNumber:
 *                 type: string
 *                 example: "123-456-7890"
 *               openTime:
 *                 type: string
 *                 format: time
 *                 example: "09:00"
 *               closeTime:
 *                 type: string
 *                 format: time
 *                 example: "17:00"
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "unique-id-123"
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 openTime:
 *                   type: string
 *                 closeTime:
 *                   type: string
 *       400:
 *         description: Invalid openTime format. Use HH:mm format.
 *       500:
 *         description: Internal server error
 */
router.post('/', clinicController.createClinic);

/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Get all clinics
 *     tags: [Clinics]
 *     description: Retrieve a list of all clinics.
 *     responses:
 *       200:
 *         description: List of clinics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "unique-id-123"
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   openTime:
 *                     type: string
 *                   closeTime:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', clinicController.getAllClinics);

/**
 * @swagger
 * /clinics/{id}:
 *   get:
 *     summary: Get clinic by ID
 *     tags: [Clinics]
 *     description: Retrieve details of a specific clinic by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the clinic to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clinic details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "unique-id-123"
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 openTime:
 *                   type: string
 *                 closeTime:
 *                   type: string
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', clinicController.fetchClinicByID);


/**
 * @swagger
 * /clinics/{id}:
 *   put:
 *     summary: Update clinic information
 *     tags: [Clinics]
 *     description: Update the details of a specific clinic.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the clinic to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               openTime:
 *                 type: string
 *                 format: time
 *                 example: "08:30"
 *               closeTime:
 *                 type: string
 *                 format: time
 *                 example: "16:30"
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "unique-id-123"
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 openTime:
 *                   type: string
 *                 closeTime:
 *                   type: string
 *       400:
 *         description: Invalid openTime format. Use HH:mm format.
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', clinicController.updateClinic);

/**
 * @swagger
 * /clinics/{id}:
 *   delete:
 *     summary: Delete a clinic
 *     tags: [Clinics]
 *     description: Delete a specific clinic by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the clinic to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clinic deleted successfully
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', clinicController.deleteClinic);

/**
 * @swagger
 * /clinics/{id}/doctors:
 *   get:
 *     summary: Get doctors by clinic ID
 *     tags: [Clinics]
 *     description: Retrieve a list of doctors associated with a specific clinic.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the clinic
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       specialization:
 *                         type: string
 *                       phone:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get('/:id/doctors', clinicController.getDoctorsByClinic);

/**
 * @swagger
 * /clinic/{doctorId}/workAt-clinic/{clinicId}:
 *   post:
 *     tags:
 *       - Doctors
 *     summary: Add doctor to clinic
 *     description: Add a doctor to a clinic with a start date for the work relationship.
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the clinic
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Doctor added to clinic successfully
 *       400:
 *         description: Failed to add doctor to clinic
 *       500:
 *         description: Internal server error
 */
router.post('/:clinicId/workAt-clinic/:doctorId', clinicController.assignDoctorToClinic);

router.delete('/:clinicId/workAt-clinic/:doctorId', clinicController.deleteWorkClinic);

module.exports = router;
