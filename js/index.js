function cyrillicSymbols(event) {
    const inputText = event.target.value;
    const cyrillicsymbols = document.getElementById('cyrillic-symbols');
    const input = document.getElementById('playername');
    const button = document.getElementById('searchsubmit');

    if (containsCyrillic(inputText)) {
        cyrillicsymbols.classList.add('visible');
        input.classList.add('error')
        button.classList.remove('allg');
    } else {
        cyrillicsymbols.classList.remove('visible');
        input.classList.remove('error')
        button.classList.add('allg');
    }
    if (inputText === '') {
        button.classList.remove('allg');
    } else {
        button.classList.add('allg');
    }
}

function containsCyrillic(text) {
    return /[а-яё]/i.test(text);
}

function redirect() {
    document.getElementById('input-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const inputText = document.getElementById('playername').value;
        localStorage.setItem('inputValue', inputText);
        window.location.href = './result.html';
    });
}

const username = '1dontkillme';
const repo = 'trainingchecker';
const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits`;

async function getLastCommitDate() {
     try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `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`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

         if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
         }

         const commits = await response.json();
         console.log('Commits:', commits);

         if (Array.isArray(commits) && commits.length > 0) {
             const lastCommitDate = commits[0].commit.committer.date;
             console.log('Last commit date:', lastCommitDate);
             const lastUpdate = new Date(lastCommitDate).toLocaleString();
             document.getElementById('lastUpdate').innerHTML = `${lastUpdate}`;
         } else {
             document.getElementById('lastUpdate').innerHTML = `<span style="color: var(--text-block)">Нет доступных обновлений</span>`;
         }
     } catch (error) {
         console.error('Error when parsing data:', error);
         document.getElementById('lastUpdate').innerHTML = `<span style="color: var(--text-block)">Ошибка при получении данных о последнем обновлении.</span>`;
     }
}

getLastCommitDate();

async function getLastCommit(username, repo) {
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits`
    
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `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`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const commits = await response.json();
    if (commits.length === 0) {
        throw new Error('Последние обновления не найдены');
    }

    const lastCommit = commits[0];
    const commitMessage = lastCommit.commit.message;

    return commitMessage;
}

getLastCommit(username, repo)
    .then(commitMessage => {
        document.getElementById('lastUpdate').title = `${commitMessage}`
    }) .catch (error => {
        console.error('Error:', error)
    })

async function getAllCommits(username, repo) {
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits`;
    let allCommits = [];
    let page = 1;

    while(true) {
        const response = await fetch(`${apiUrl}?page=${page}`, {
            headers: {
                'Authorization': `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`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        const commits = await response.json();
        if (commits.length === 0) {
            break;
        }
        allCommits = allCommits.concat(commits.map(commit => commit.commit.message));
        page++;
    }


    return allCommits
}

getAllCommits(username, repo)
    .then(commitMessages => {
        const listElement = document.getElementById('allupdates');
        listElement.innerHTML = '';
        commitMessages.forEach(message => {
            const listItem = document.createElement('li');
            listItem.textContent = `${message};`;
            listElement.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });