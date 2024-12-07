const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: API for managing appointments
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Create a new appointment
 *     description: |
 *       Add a new appointment for a doctor and patient, ensuring there are no conflicts
 *       with existing schedules and the clinic's opening hours.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "b45d8c1e-6789-4b2f-a1cd-76e6bff8c6e3"
 *               patientId:
 *                 type: string
 *                 example: "c32f5d1f-9876-4e7a-a9ab-12cd76f8a9e7"
 *               clinicId:
 *                 type: string
 *                 example: "a45f8e1c-2345-67bc-df90-9b8f7d0e1f2a"
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-05T10:30:00.000Z"
 *               duration:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "d35f5b1a-98cd-4e7a-b8ac-76e6bfc8d9f7"
 *                 doctorId:
 *                   type: string
 *                 patientId:
 *                   type: string
 *                 clinicId:
 *                   type: string
 *                 appointmentDate:
 *                   type: string
 *                   format: date-time
 *                 duration:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   example: "Scheduled"
 *       400:
 *         description: Conflict with existing schedules or invalid time format
 *       404:
 *         description: Doctor, patient, or clinic not found
 *       500:
 *         description: Internal server error
 */
router.post('/', appointmentController.addAppointment);

/**
 * @swagger
 * /appointments/{appointmentId}/status:
 *   put:
 *     tags:
 *       - Appointments
 *     summary: Update the status of an appointment
 *     description: |
 *       Change the status of an existing appointment. The status must be one of the valid 
 *       values: Scheduled, Cancelled, or Completed.
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         description: ID of the appointment to update
 *         schema:
 *           type: string
 *           example: "d35f5b1a-98cd-4e7a-b8ac-76e6bfc8d9f7"
 *       - in: body
 *         name: body
 *         required: true
 *         description: Status update data
 *         schema:
 *           type: object
 *           properties:
 *             newStatus:
 *               type: string
 *               description: New status for the appointment
 *               example: "Completed"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status or client error
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.put('/:appointmentId/status', appointmentController.updateAppointmentStatus);


/**
 * @swagger
 * /appointments/{appointmentId}:
 *   delete:
 *     tags:
 *       - Appointments
 *     summary: Delete an appointment
 *     description: Remove an appointment by its ID.
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         description: ID of the appointment to delete
 *         schema:
 *           type: string
 *           example: "d35f5b1a-98cd-4e7a-b8ac-76e6bfc8d9f7"
 *     responses:
 *       204:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:appointmentId', appointmentController.deleteAppointment);

/**
 * @swagger
 * /appointments/{appointmentId}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get appointment details by ID
 *     description: Retrieve the details of an appointment by its ID.
 *     parameters:
 *       - name: appointmentId
 *         in: path
 *         required: true
 *         description: The ID of the appointment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details retrieved successfully
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.get('/:appointmentId', appointmentController.getAppointment);

/**
 * @swagger
 * /appointments/{appointmentId}/doctors:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get doctors participating in an appointment
 *     description: Retrieve a list of doctors who are participating in a specific appointment.
 *     parameters:
 *       - name: appointmentId
 *         in: path
 *         required: true
 *         description: The ID of the appointment to retrieve the doctors from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doctors participating in the appointment
 *       500:
 *         description: Internal server error
 */
router.get('/:appointmentId/doctors', appointmentController.getDoctors);

/**
 * @swagger
 * /appointments/{appointmentId}/patients:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get patients participating in an appointment
 *     description: Retrieve a list of patients who are participating in a specific appointment.
 *     parameters:
 *       - name: appointmentId
 *         in: path
 *         required: true
 *         description: The ID of the appointment to retrieve the patients from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of patients participating in the appointment
 *       500:
 *         description: Internal server error
 */
router.get('/:appointmentId/patients', appointmentController.getPatients);

/**
 * @swagger
 * /appointments/{appointmentId}/clinic:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get the clinic hosting an appointment
 *     description: Retrieve the clinic information for a specific appointment.
 *     parameters:
 *       - name: appointmentId
 *         in: path
 *         required: true
 *         description: The ID of the appointment to retrieve the clinic from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clinic information for the appointment
 *       500:
 *         description: Internal server error
 */
router.get('/:appointmentId/clinic', appointmentController.getClinic);

/**
 * @swagger
 * /appointments/add-doctor:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Add a doctor to an existing appointment
 *     description: Adds a doctor to an existing appointment after checking for scheduling conflicts.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 example: "d35f5b1a-98cd-4e7a-b8ac-76e6bfc8d9f7"
 *               doctorId:
 *                 type: string
 *                 example: "b45d8c1e-6789-4b2f-a1cd-76e6bff8c6e3"
 *     responses:
 *       200:
 *         description: Doctor added to appointment successfully
 *       400:
 *         description: Bad request due to scheduling conflicts or missing data
 *       404:
 *         description: Appointment or doctor not found
 *       500:
 *         description: Internal server error
 */
router.post('/add-doctor', appointmentController.addDoctorToAppointment);

module.exports = router;
