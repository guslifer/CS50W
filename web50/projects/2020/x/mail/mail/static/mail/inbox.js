document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
  //liten to user hitting submit button to send an email
  document.querySelector("#submit_email").addEventListener('click', () => {
    let recipients = document.getElementById("compose-recipients").value;
    let body = document.getElementById("compose-body").value;
    let subject = document.getElementById("compose-subject").value;
    send_email(recipients, subject, body);
  });
  


  });
  
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  json_response = get_mailboxEmails(mailbox);
  json_response.then((emails) => {
  var divAtual = document.getElementById('emails-view');
  var response_lenght = Object.keys(emails).length;

  if(response_lenght == 0)
  {
    console.log("Sem emails")
  }
    else
    {
      for(let i=0; i<response_lenght; i++){

        let sender = emails[i]["sender"];
        let timestamp = emails[i]["timestamp"];
        let subject = emails[i]["subject"];

      
        let container = document.createElement('div');
        container.classList.add("card", "border-primary", "mb-3", "container");
        if(emails[i]["read"] == true){
          container.style.backgroundColor = "#e6e6e6";
        }
        else{
          container.style.backgroundColor = "white";
        }
        container.id = emails[i]["id"];
        let container_row1 = document.createElement('div');
        container_row1.classList.add("card-header", "row");
        container.appendChild(container_row1);

        let row_1_col_1 = document.createElement('div');
        row_1_col_1.classList.add("col-sm-8");
        container_row1.appendChild(row_1_col_1);

        let row_1_col1_content = document.createElement("h5");
        row_1_col1_content.innerHTML = sender;
        row_1_col_1.appendChild(row_1_col1_content);

        let row_1_col_2 = document.createElement('div');
        row_1_col_2.classList.add("col-sm-4");
        container_row1.appendChild(row_1_col_2);

        let row_1_col_2_content = document.createElement('p');
        row_1_col_2_content.classList.add("card-text");
        row_1_col_2_content.innerHTML = timestamp;
        row_1_col_2.appendChild(row_1_col_2_content);

        let row_2 = document.createElement('div');
        row_2.classList.add("card-body", "text-primary", "row");
        container.appendChild(row_2);

        let row_2_content = document.createElement('h5');
        row_2_content.classList.add("card-title", "col-sm-10");
        row_2_content.innerHTML = subject;
        row_2.appendChild(row_2_content);

        let row_2_button = document.createElement('button');
        row_2_button.classList.add("col-sm-2", "btn", "btn-sm" ,"btn-outline-primary");
        row_2_button.id = emails[i]["id"];
        row_2_button.innerHTML = "View Email";
        //trigger to read email, passing email id as parameter
        row_2_button.addEventListener('click', function () {read_email(container, this.id, emails[i]);});
        row_2.appendChild(row_2_button);
        


        
        divAtual.appendChild(container);//adiciona o nó de texto à nova div criada
    }
  } 
});

  
}

function send_email(c_recipient, c_subject, c_body){
  //receives the infos about the email writed and send a POST request with Json body
  fetch('/emails', {method: 'POST', body: JSON.stringify({
    recipients: c_recipient,
    subject: c_subject,
    body: c_body })
   });
   //redirects to 'sent' mailbox
   load_mailbox('sent');

}

//colect emails from mailbox and return a promisse with a Json object as result
async function get_mailboxEmails(mailbox){
  let get_mails = await fetch("/emails/"+mailbox);
  response = await get_mails.json();
  return response;
}

function read_email(container, email_id, email){
  //runs the routine when an emails is readed
    var modalWrap = null;
    var archive_name = "Archive";
    teste = "ID: "+ email_id;
    modalWrap = document.createElement('div');
    if(email["archived"] == true){
      archive_name = "Unarchive";
    }
    
    //creates the modal that will use to read the email
    modalWrap.innerHTML = `
    <div class="modal" tabindex="-1" role="dialog" id='modal_${email_id}'>
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
            <div class = "container">
                <div class="row"> 
                  <p class="col-sm-7">from:${email["sender"]} </p>
                  <p class="col-sm-5">${email["timestamp"]}</p>
                </div>
                <div class="row"> 
                  <h5 class="modal-title">${email["subject"]}</h5>
                </div>
            </div>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>${email["body"]}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id = "button_archive${email["id"]}"data-dismiss="modal">${archive_name}</button>
              <button type="button" class="btn btn-primary">Answer</button>
            </div>
          </div>
        </div>
    </div>
    `;
   document.body.append(modalWrap);
   id = '#'+'modal_' + email_id;
   buttonA_id = "#" + "button_archive" + email["id"];
   //update the email container after user viewed email
   $(id).on('hidden.bs.modal', function () {
    container.style.backgroundColor = "#e6e6e6";
   });
   //open email as a modal
   $(id).modal('show').on("shown.bs.modal", function () {                
});

 //updated email status as (un)archived
  document.querySelector(buttonA_id).addEventListener("click", () => {
    if(archive_name === "Archive"){
      fetch('/emails/'+ String(email["id"]), {
        method: 'PUT',
        body: JSON.stringify({
            archived: true
        })
      });
      //redirects to 'inbox' mailbox
      location.reload();
      load_mailbox('inbox');
    }
    else{
      fetch('/emails/'+ String(email["id"]), {
        method: 'PUT',
        body: JSON.stringify({
            archived: false
        })
      });
      //redirects to 'inbox' mailbox
      location.reload();
      load_mailbox('inbox');
    }
  });

  //updated email status as read
   fetch('/emails/'+ String(email["id"]), {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });

}