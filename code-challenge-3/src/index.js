//Your code here
//The event listener below is executed once the DOM loads
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/films")
        .then(res => res.json())
        .then(data => {
            
//Obtain the element whose id is films an  removes the li element inside it
            let filmTitles = document.getElementById("films");
            filmTitles.querySelector("li").remove();

 
 //For each value inside the data a list element is created and the nam of the film is stored in it
            data.forEach(film => {
                let listItem = document.createElement("li");
                listItem.textContent = film.title;
                listItem.className = "film-item";
                filmTitles.appendChild(listItem);

//The button below uses delete method to remove the name of a movie from the list when clicked
                let button = document.createElement("button");
                button.textContent = "DELETE";
                listItem.appendChild(button);

                button.addEventListener("click", (e) => {
                    e.target.parentNode.remove();

                    fetch(`http://localhost:3000/films/${film.id}`, {
                        method: "DELETE",
                        headers: {
                            'Content-Type': 'application/json',
                            "Accept": "application/json",
                        }
                    })
                    .then(res => res.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('The error encountered in deleting the film is:', error));
                });
            });
        });

//When displaying the first movie inside data:
    fetch("http://localhost:3000/films")
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("An error was encountered");
            }
        })

//We obtain the movie details from data then store them inside variables which them hold information about the films
        .then((data) => {
            function movieDetails(data) {
                let title = document.getElementById("title");
                title.textContent = data.title;

                let poster = document.getElementById("poster");
                poster.src = data.poster;

                let runtime = document.getElementById("runtime");
                runtime.textContent = `${data.runtime} minutes`;

                let description = document.getElementById("film-info");
                description.textContent = data.description;

                let showtime = document.getElementById("showtime");
                showtime.textContent = data.showtime;

                let ticketsAvailable = data.capacity - data.tickets_sold;
                let remainingTickets = document.getElementById("ticket-num");
                remainingTickets.textContent = ticketsAvailable;
            }

//If the number of items in data is greater than 0, we pick the first one then make sure its details are the ones displayed once DOM loads.
            if (data.length > 0) {
                let currentMovie = data[0];
                movieDetails(currentMovie);


//Adding functionality to the buy ticket button                
                let buyTickets = document.getElementById("buy-ticket");
                buyTickets.addEventListener("click", () => {
                    fetch("http://localhost:3000/films")
                        .then(res => res.json())
                        .then(data => {

//When the button is clicked, we use the details of the movie currently on display        
                            let currentMovie = data[0];
                            let ticketsAvailable = currentMovie.capacity - currentMovie.tickets_sold;
                            let remainingTickets = document.getElementById("ticket-num");
                            remainingTickets.textContent = ticketsAvailable;

//If the movie tickets are sold out, the button is disabled and its text content is changed, it is also added a class 
                            if (ticketsAvailable <= 0) {
                                buyTickets.textContent = "Sold Out";
                                buyTickets.disabled = true;
                                let filmItem = document.querySelector(`ul#films li[data-id="${currentMovie.id}"]`);
                                filmItem.className = "sold-out film item";
                            } else {

//We update the value tickets_sold. Patch method is used because we are only modifying one thing about the film
                                fetch(`http://localhost:3000/films/${currentMovie.id}`, {
                                    method: "PATCH",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        "Accept": "application/json",
                                    },
                                    body: JSON.stringify({

//We add one to the number of tickets sold                                         
                                        tickets_sold: currentMovie.tickets_sold + 1
                                    })
                                })
                                .then(res => res.json())
                                .then(updatedData => {

//The data of that one film is all updated by using POST method
                                    console.log(updatedData);
                                    let ticketsLeft = ticketsAvailable - updatedData.tickets_sold;
                                    fetch('http://localhost:3000/tickets', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            "Accept": "application/json",
                                        },
                                        body: JSON.stringify({
                                            film_id: currentMovie.id,
                                            number_of_tickets: ticketsLeft
                                        })
                                    })
                                    .then(res => res.json())

//After the first buyer is done, data for the new ticket is then put into newTicket                                    
                                    .then(newTicket => {
                                        return newTicket;
                                    })
                                });
                            }
                        })
                });
            }
        });
});
