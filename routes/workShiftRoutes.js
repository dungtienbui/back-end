const express = require('express');
const router = express.Router();
const workShiftController = require('../controllers/workShiftController');

/**
 * @swagger
 * tags:
 *   name: WorkShifts
 *   description: API for managing work shifts for doctors
 */

/**
 * @swagger
 * /work-shifts:
 *   post:
 *     tags:
 *       - WorkShifts
 *     summary: Add a new work shift
 *     description: Create a new work shift for a doctor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "12345"
 *               day:
 *                 type: string
 *                 example: "Monday"
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *     responses:
 *       201:
 *         description: Work shift added successfully
 *       400:
 *         description: Invalid input or conflict detected
 *       500:
 *         description: Internal server error
 */
router.post('/', workShiftController.addWorkShift);

/**
 * @swagger
 * /work-shifts/{id}:
 *   put:
 *     tags:
 *       - WorkShifts
 *     summary: Update a work shift
 *     description: Update an existing work shift for a doctor.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the work shift
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "12345"
 *               day:
 *                 type: string
 *                 example: "Monday"
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *     responses:
 *       200:
 *         description: Work shift updated successfully
 *       400:
 *         description: Invalid input or conflict detected
 *       500:
 *         description: Internal server error
 */
router.put('/:id', workShiftController.updateWorkShift);

/**
 * @swagger
 * /work-shifts/{id}:
 *   delete:
 *     tags:
 *       - WorkShifts
 *     summary: Delete a work shift
 *     description: Delete an existing work shift for a doctor.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the work shift to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Work shift deleted successfully
 *       404:
 *         description: Work shift not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', workShiftController.deleteWorkShift);

/**
 * @swagger
 * /work-shifts/{doctorId}/{day}:
 *   get:
 *     tags:
 *       - WorkShifts
 *     summary: Get work shifts by day for a specific doctor
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         description: The ID of the doctor
 *         schema:
 *           type: string
 *       - in: path
 *         name: day
 *         required: true
 *         description: The day of the week (e.g., "Monday")
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of work shifts for the specified day
 *       404:
 *         description: No work shifts found for the specified day
 *       500:
 *         description: Internal server error
 */
router.get('/:doctorId/:day', workShiftController.getWorkShiftsByDay);

module.exports = router;
