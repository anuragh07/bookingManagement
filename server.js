
const express = require('express');
const mysql = require('mysql2');
const bodyparser = require('body-parser');
const app = express();
const port = 8080;
const path = require('path');
// const fs = require('fs');
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Benna@2011',
    database: 'hackathon'
});
database.connect(err => {
    if (err) {
        throw err;
    }
    console.log("Connected to the database.")
});

app.get('/bookings', (req, res) => {
    const statement = "SELECT * FROM bookings";
    database.query(statement, (err, result) => {
        if (err) {
            throw err;
        }
        console.log("GET method for all the records is successful.");
        res.json(result);
    })
})

app.get('/bookings/:id', (req, res) => {
    const statement = 'SELECT * FROM bookings WHERE id = ?';
    database.query(statement, [req.params.id], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "booking not found" });
        }
        console.log(`GET request for booking with id: ${req.params.id}`);
        res.json(result[0]);
    });
});

app.post('/bookings', (req, res) => {
    const  {id,...newBooking}  = req.body;
    // console.log("booking data:", newBooking);

    if (Object.keys(newBooking).length === 0) {
        console.log(`Booking data is required`);
        return res.status(400).json({ message: "Booking data is required" });
    }

    const statement = "INSERT INTO bookings SET ?";
    database.query(statement, newBooking, (err, result) => {
        if (err) {
            console.log("Error inserting booking data:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        console.log(`The booking details are added to the database`);
        res.status(201).json({
            message: "booking data has been inserted into the database", booking: {
                id: result.insertId,
                ...newBooking
            }
        });
    });
})

app.put('/bookings/:id', (req, res) => {
    const updatedBooking = req.body;
    if (Object.keys(updatedBooking).length === 0) {
        return res.status(400).json({ message: "Booking data is required" });
    }
    const q = "UPDATE bookings SET ? WHERE id = ?";
    database.query(q, [updatedBooking, req.params.id], (err, result) => {
        if (err) {
            console.log("Error updating booking record:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        console.log(`The booking details have been updated in the database`);
        res.status(200).json({ message: "booking data has been updated", booking: { id: req.params.id, ...updatedBooking } });
    });
});

app.delete('/bookings/:id', (req, res) => {
    const statement = "DELETE FROM bookings WHERE id = ?";
    database.query(statement, [req.params.id], (err, result) => {
        if (err) {
            console.log("Internal server error");
            return res.status(500).json({ message: "Internal server error" });
        }
        console.log(`Booking record with id: ${req.params.id} has been delete successfully.`);
        res.status(200).json({ message: "Booking record has been deleted successfully." })

    })
})

app.listen(port, () => {
    console.log(`Server is running at port: ${port}, http://localhost:${port}`);
})