let rooms = [
    { id: 1, roomName: "Conference Room", seats: 100, amenities: ["Projector", "Whiteboard"], pricePerHour: 1000 },
    { id: 2, roomName: "Meeting Room ", seats: 50, amenities: ["AC", "Speaker"], pricePerHour: 500 }
];

let bookings = [
    { id: 1, customerName: "harish", date: "2024-08-15", startTime: "09:00", endTime: "11:00", roomId: 1, status: "Booked" },
    { id: 2, customerName: "manoj", date: "2024-08-16", startTime: "14:00", endTime: "15:00", roomId: 2, status: "Booked" }
];


const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Hall Booking API!');
});

//creat a room
app.post('/rooms', (req, res) => {
    const room = {
        id: rooms.length + 1,
        ...req.body
    };
    rooms.push(room);
    res.status(201).send(room);
});


//booking a room
app.post('/bookings', (req, res) => {
    const booking = {
        id: bookings.length + 1,
        ...req.body,
        status: 'Booked'
    };
    bookings.push(booking);
    res.status(201).send(booking);
});


//listing rooms with booked data
app.get('/rooms', (req, res) => {
    const roomDetails = rooms.map(room => {
        const roomBookings = bookings.filter(booking => booking.roomId === room.id);
        return { ...room, bookings: roomBookings };
    });
    res.send(roomDetails);
});

//listing customers data
app.get('/customers', (req, res) => {
    const customerBookings = bookings.map(booking => {
        const room = rooms.find(room => room.id === booking.roomId);
        
        if (room) {  // Check if the room exists
            return {
                customerName: booking.customerName,
                roomName: room.roomName,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime
            };
        } else {
            return {
                customerName: booking.customerName,
                roomName: "Room not found",  // Handle missing room case
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime
            };
        }
    });

    res.send(customerBookings);
});

//no.of times room booked
app.get('/customer/:name/bookings', (req, res) => {
    const customerName = req.params.name;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    res.send(customerBookings);
});


