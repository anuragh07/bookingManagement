document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('bookingForm');
    const bookingIdInput = document.getElementById('bookingId');
    const queryString = window.location.search;
    const bookingId = queryString.split('?id=')[1];
    if (bookingId){
        fetch(`/bookings/${bookingId}`)
            .then(response => response.json())
            .then(booking => {
                bookingIdInput.value = booking.id;
                form.customer_name.value = booking.customer_name;
                form.booking_date.value = formatDate(booking.booking_date);
                form.booking_time.value = booking.booking_time;
                form.total_amount.value = booking.total_amount;
                form.status.value = booking.status;
                form.payment_method.value = booking.payment_method;
                form.duration_minutes.value = booking.duration_minutes;
            })
            .catch(error => console.error('Error loading booking details:', error));
    }
    function formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "";
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = {
            id: bookingIdInput.value,
            customer_name: form.customer_name.value,
            booking_date: form.booking_date.value,
            booking_time: form.booking_time.value,
            total_amount: form.total_amount.value,
            status: form.status.value,
            payment_method: form.payment_method.value,
            duration_minutes: form.duration_minutes.value
        };

        const method = bookingId ? 'PUT' : 'POST';
        const url = `/bookings${bookingId ? '/' + bookingId : ''}`;
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                window.location.href = 'index.html'; 
            } else {
                throw new Error('Failed to save booking');
            }
        })
        .catch(error => console.error('Error saving booking:', error));
    });
});
