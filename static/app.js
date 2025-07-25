class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const text1 = textField.value;

        if (text1 === "") {
            return;
        }

        const msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        fetch(`${$SCRIPT_ROOT}/predict`, {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.json())
        .then(r => {
            const msg2 = { name: "Sam", message: r.answer }; // Use "Sam" to match HTML greeting and your update logic
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            textField.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = '';
        });

        this.updateChatText(chatbox);
        textField.value = '';
    }

    updateChatText(chatbox) {
        let html = '';

        this.messages.slice().reverse().forEach(function(item) {
            if (item.name === "Sam") {
                html += `<div class="messages__item messages__item--visitor">${item.message}</div>`;
            } else {
                html += `<div class="messages__item messages__item--operator">${item.message}</div>`;
            }
        });

        const chatMessage = chatbox.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();
