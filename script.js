document.getElementById('start-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    if (username) {
        startGame(username);
    }
});

document.getElementById('load-game').addEventListener('click', loadGame);
document.getElementById('save-game').addEventListener('click', saveGame);

let state = {};

function startGame(username) {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('player-name').innerText = `Joueur: ${username}`;
    state = { username: username, currentNode: 1 };
    showTextNode(1);
}

function loadGame() {
    const savedState = JSON.parse(localStorage.getItem('adventureGameState'));
    if (savedState) {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        document.getElementById('player-name').innerText = `Joueur: ${savedState.username}`;
        state = savedState;
        showTextNode(state.currentNode);
    } else {
        alert('Aucune sauvegarde trouvée.');
    }
}

function saveGame() {
    localStorage.setItem('adventureGameState', JSON.stringify(state));
    alert('Partie sauvegardée!');
}

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(node => node.id === textNodeIndex);
    document.getElementById('story').innerHTML = textNode.text;

    while (document.getElementById('choices').firstChild) {
        document.getElementById('choices').removeChild(document.getElementById('choices').firstChild);
    }

    textNode.options.forEach(option => {
        if (showOption(option)) {
            const button = document.createElement('button');
            button.innerText = option.text;
            button.classList.add('choice');
            button.addEventListener('click', () => selectOption(option));
            document.getElementById('choices').appendChild(button);
        }
    });
}

function showOption(option) {
    return option.requiredState == null || option.requiredState(state);
}

function selectOption(option) {
    const nextTextNodeId = option.nextText;
    state.currentNode = nextTextNodeId;
    showTextNode(nextTextNodeId);
}

const textNodes = [
    {
        id: 1,
        text: 'Vous vous réveillez dans une maison sombre. Que faites-vous?',
        options: [
            {
                text: 'Explorer la pièce',
                nextText: 2
            },
            {
                text: 'Sortir de la pièce',
                nextText: 3
            }
        ]
    },
    {
        id: 2,
        text: 'Vous trouvez une clé dorée et une note mystérieuse.',
        options: [
            {
                text: 'Lire la note',
                nextText: 4
            },
            {
                text: 'Ignorer la note',
                nextText: 4
            }
        ]
    },
    {
        id: 3,
        text: 'Vous sortez de la pièce et entrez dans un grand hall. Un vieil homme vous regarde fixement.',
        options: [
            {
                text: 'Parler à l\'homme',
                nextText: 5
            },
            {
                text: 'Ignorer l\'homme et explorer le hall',
                nextText: 6
            }
        ]
    },
    {
        id: 4,
        text: 'La note parle d\'un trésor caché dans la maison. Elle mentionne aussi un danger imminent.',
        options: [
            {
                text: 'Chercher le trésor',
                nextText: 7
            },
            {
                text: 'Retourner au hall',
                nextText: 3
            }
        ]
    },
    {
        id: 5,
        text: 'L\'homme vous raconte l\'histoire de la maison. Il parle d\'un trésor caché et d\'un danger.',
        options: [
            {
                text: 'Continuer à chercher le trésor',
                nextText: 7
            },
            {
                text: 'Quitter la maison',
                nextText: 8
            }
        ]
    },
    {
        id: 6,
        text: 'Vous trouvez une porte verrouillée et une autre pièce sombre.',
        options: [
            {
                text: 'Ouvrir la porte verrouillée avec la clé dorée',
                requiredState: (currentState) => currentState.inventory.includes('clé dorée'),
                nextText: 9
            },
            {
                text: 'Explorer la pièce sombre',
                nextText: 10
            },
            {
                text: 'Retourner au hall',
                nextText: 3
            }
        ]
    },
    {
        id: 7,
        text: 'Vous trouvez le trésor, mais vous déclenchez un piège mortel. Game Over.',
        options: [
            {
                text: 'Recommencer',
                nextText: 1
            }
        ]
    },
    {
        id: 8,
        text: 'Vous quittez la maison en sécurité. Félicitations, vous avez réussi!',
        options: [
            {
                text: 'Recommencer',
                nextText: 1
            }
        ]
    },
    {
        id: 9,
        text: 'La porte s\'ouvre sur une pièce secrète. Vous trouvez le trésor caché!',
        options: [
            {
                text: 'Prendre le trésor et sortir de la maison',
                nextText: 11
            }
        ]
    },
    {
        id: 10,
        text: 'Vous tombez dans un piège mortel. Game Over.',
        options: [
            {
                text: 'Recommencer',
                nextText: 1
            }
        ]
    },
    {
        id: 11,
        text: 'Vous avez réussi à sortir de la maison avec le trésor. Félicitations, vous avez gagné!',
        options: [
            {
                text: 'Recommencer',
                nextText: 1
            }
        ]
    }
];
