//Your code here
//The event listener runs the function as soon as DOM loads
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/films")
    .then(res => res.json())
    .then(data =>{

//The element with the id "films" is selected and the list element and its contents are removed
        let filmTitles = document.getElementById("films");
        filmTitles.querySelector("li").remove();

//For each data element obtained (film titles), they are passed through the call back function which makes them into a list
        data.forEach(film => {
            let listItem = document.createElement("li");
            listItem.textContent = film.title;
            listItem.className = "film-item";
            filmTitles.appendChild(listItem);

//The button element is created then it is appended into each list item 
            let button = document.createElement("button");
            button.textContent = "DELETE";
            listItem.appendChild(button);

//When the button is clicked, the delete method is executed on the selected title name
            button.addEventListener("click", (e) =>{
                e.target.parentNode.remove();

                fetch(`http://localhost:3000/films/${film.id}`,{
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                    }
                })
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(error => console.error('THe error encountered in deleting the film is:', error));
            });
        });
    })
    .catch(error => console.error('The error encountered was:', error));
});


//The event listener loads the first movie's details immediately DOM loads
document.addEventListener("DOMContentLoaded", () =>{
    fetch("http://localhost:3000/films/1")
    .then (res => res.json())
    .then(data => {
//Erase the initial content of each id element required then replace the content
        let title = document.getElementById("title")
        title.textContent = " "
        title.textContent = data.title

        let poster = document.getElementById("poster")
        poster.src = " "
        poster.src = data.poster

        let runtime = document.getElementById("runtime")
        runtime.textContent = " "
        runtime.textContent = `${data.runtime} minutes`

        let description = document.getElementById("film-info")
        description.textContent = " "
        description.textContent = data.description
    
        let showtime = document.getElementById("showtime")
        showtime.textContent = " "
        showtime.textContent = data.showtime

//The tickets sold are subtracted from the theatre capacity to obtain the number of remaining tickets
        let ticketsAvailable = data.capacity - data.tickets_sold
        let remainingTickets = document.getElementById("ticket-num")
        remainingTickets.textContent = " " 
        remainingTickets.textContent = ticketsAvailable

//This adds functionality to the buy tickets button
    let buyTickets = document.getElementById("buy-ticket" )
    buyTickets.addEventListener("click", () => {

//If a movie sells out, the buy tickets button is disabled and a class s added to the disabled movie 
    if(ticketsAvailable <= 0 ){
        buyTickets.textContent = "Sold Out";
        buyTickets.disabled = true;
        let filmItem = document.querySelector(`ul#films li[data-id="${data.id}"]`)
        filmItem.className = "sold-out film item" 
    }
//However, if there are still some tickets left then the number of tickets sold changes since we add 1 to it. Only the tickets_sold is updated.  
    else{
    fetch(`http://localhost:3000/films/${data.id}`,{
method : "PATCH",
headers:  {'Content-Type': 'application/json',
          "Accept": "application/json",},
body: JSON.stringify({
    tickets_sold : data.tickets_sold + 1
})
    })
//Then the film data inside the JSON object is changed to modify the Tickets Left.
    .then(res =>res.json())
    .then(updatedData => {
    console.log(updatedData)
    let ticketsLeft = ticketsAvailable - updatedData.tickets_sold
    fetch('http://localhost:3000/tickets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                          },
                    body: JSON.stringify({
                        film_id: data.id,
                        number_of_tickets: ticketsLeft
                    })
                })
                .then(res => res.json())
//After that user buys a ticket, the details of the new ticket are stored in newTicket variable then returned
                .then(newTicket => {return newTicket})
            })
        }
    })

}
    )}
)
