document.addEventListener("DOMContentLoaded", () => {
    const bookingsTable = document.querySelector('#bookingsTable tbody');
    function loadBookings() {
        fetch('/bookings')
            .then(response => response.json())
            .then(bookings => {
                bookingsTable.innerHTML = '';
                bookings.forEach(booking => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${booking.id}</td>
                        <td>${booking.customer_name}</td>
                        <td>${formatDateDisplay(booking.booking_date)}</td>
                        <td>${booking.booking_time}</td>
                        <td>${booking.total_amount || ''}</td>
                        <td>${booking.status}</td>
                        <td>${booking.payment_method || ''}</td>
                        <td>${booking.duration_minutes || ''}</td>
                        <td>
                            <button id="editBtn" onclick="editBooking('${booking.id}')">Edit</button>
                            <button id="deleteBtn" onclick="deleteBooking('${booking.id}')">Delete</button>
                        </td>`;
                    bookingsTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading bookings:', error));
    }
    function formatDateDisplay(dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "";
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    window.editBooking = function (id) {
        window.location.href = `form.html?id=${id}`;
    };
    window.deleteBooking = function (id) {
        fetch(`/bookings/${id}`, {
            method:
                'DELETE'
        })
            .then(response => {
                if (response.ok) loadBookings();
                else throw new Error('Failed to delete booking');
            })
            .catch(error => console.error('Error deleting booking:', error));
    };



    window.openFormPage = function () {
        window.location.href = "form.html";
    };
    
    loadBookings();
});
