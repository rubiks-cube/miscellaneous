const numberInput = document.getElementById('number');
const msgInput =  document.getElementById('msg');
const button = document.getElementById('btn');
const response = document.querySelector('.response');

button.addEventListener('click', send, false);

function send(){
    const number = numberInput.value.replace(/\D/g,'');
    const msg = msgInput.value;
    
    
    fetch('/send', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({number: number, msg: msg})
    })
    .then(response => {
        res = response.json();
        return res;
    })
    .then(res => {
    
        num = res.data.number.replace('91','');
        response.innerHTML = '<h3>Successfully sent to ' + num  + ' </h3>';
    })
    .catch(err => {
    console.log(err);
    });



}
    


  

