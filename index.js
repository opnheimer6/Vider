window.onload = function() {
    const btn = document.getElementById('btn-on');
    const scene = document.getElementById('v-scene');
    const con = document.getElementById('v-console');
    const edit = document.getElementById('vider-editor'); // POPRAWIONE ID
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // --- ŁADOWANIE AUTO-SAVE (Przy starcie) ---
    const savedCode = localStorage.getItem('vider_autosave');
    if (savedCode) {
        edit.value = savedCode;
    }

    // --- FUNKCJA AUTO-SAVE (Zapisuje przy każdym wpisanym znaku) ---
    edit.addEventListener('input', () => {
        localStorage.setItem('vider_autosave', edit.value);
    });

    // --- GŁÓWNA LOGIKA URUCHAMIANIA ---
    btn.onclick = async function() {
        scene.innerHTML = ''; 
        con.innerHTML = '<div style="color:#555">-- Vider v3.4 [FULL SYSTEM] --</div>';
        
        const lines = edit.value.split('\n');
        let viderMemory = {}; 
        let viderIndex = [];
        let tableRef = null;
        let lineNum = 0;

        for (let line of lines) {
            lineNum++;
            let l = line.trim();
            if (!l || l.startsWith("//")) continue;

            try {
                // Podmiana zmiennych
                for (let key in viderMemory) {
                    l = l.split(key).join(viderMemory[key]);
                }

                // Tabela
                if (l.includes("Table Create on $UNO$")) {
                    tableRef = document.createElement('table');
                    tableRef.style.width = "100%";
                    tableRef.style.borderCollapse = "collapse";
                    tableRef.style.marginTop = "10px";
                    scene.appendChild(tableRef);
                    continue;
                }

                // Składnia <col> <imp> <ims>
                if (l.startsWith("<") && l.endsWith(">")) {
                    let type = l.substring(1, 4);
                    let contentMatch = l.match(/<(?:col|imp|ims)\s+(.*)>/);
                    if (contentMatch) {
                        let content = contentMatch[1];
                        let cells = content.split(",").map(c => c.trim().replace(/"/g, ""));
                        let row = document.createElement('tr');
                        
                        cells.forEach(c => {
                            let td = document.createElement('td');
                            td.innerText = c;
                            td.style.border = "1px solid white";
                            td.style.padding = "8px";
                            td.style.color = "white";
                            if (type === "col") {
                                td.style.fontWeight = "bold";
                                td.style.backgroundColor = "#333";
                            }
                            row.appendChild(td);
                        });

                        if (tableRef) {
                            if (type === "col") tableRef.prepend(row);
                            else tableRef.appendChild(row);
                        }
                    }
                    continue;
                }

                // Kolorowanie []
                if (l.startsWith("[]") && l.includes("color.")) {
                    let target = l.match(/"(.*?)"/)[1];
                    let color = l.split("=")[1].trim().replace(",", "");
                    let allCells = document.getElementsByTagName('td');
                    for (let cell of allCells) {
                        if (cell.innerText === target) cell.style.color = color;
                    }
                    continue;
                }

                // ask. i set.
                if (l.startsWith("ask.") && l.endsWith(",")) {
                    let content = l.substring(4, l.length - 1).trim();
                    let varName = content.match(/\$.*?\$/)[0];
                    let question = content.match(/"(.*?)"/)[1];
                    let userInput = prompt(question); 
                    viderMemory[varName] = userInput;
                    con.innerHTML += `<div style="color:#00aaff">[INPUT]: ${varName} = ${userInput}</div>`;
                    continue;
                }

                if (l.startsWith("set.") && l.endsWith(",")) {
                    let content = l.substring(4, l.length - 1).trim();
                    let [vName, vVal] = content.split("=").map(s => s.trim());
                    if (vVal.includes("random")) {
                        let r = vVal.match(/\((.*?)\)/)[1].split(",").map(n => parseInt(n.trim()));
                        viderMemory[vName] = Math.floor(Math.random() * (r[1] - r[0] + 1)) + r[0];
                        con.innerHTML += `<div style="color:#ffcc00">[DICE]: ${vName} = ${viderMemory[vName]}</div>`;
                    } else {
                        viderMemory[vName] = vVal;
                        con.innerHTML += `<div style="color:#44ffaa">[MEM]: ${vName} OK.</div>`;
                    }
                    continue;
                }

                // Systemowe
                if (l.startsWith("Vider on print")) {
                    let txt = l.match(/\("(.*)"\)/);
                    if (txt) con.innerHTML += `<div style="color:white">> ${txt[1]}</div>`;
                    continue;
                }
                if (l.startsWith("task.wait")) {
                    await sleep(parseInt(l.match(/\((\d+)\)/)[1]) * 1000);
                    continue;
                }
                if (l.startsWith("sum")) {
                    let res = eval(l.match(/\((.*)\)/)[1]);
                    con.innerHTML += `<div style="color:#00ff00">RACHUNEK: ${res}</div>`;
                    continue;
                }
                if (l.startsWith("Create Index of")) {
                    viderIndex = Array.from({length: parseInt(l.match(/\((\d+)\)/)[1]) + 1}, (_, i) => i);
                    continue;
                }
                if (l.startsWith("Repeat")) {
                    let times = parseInt(l.match(/Repeat\s*\((\d+)\)/)[1]);
                    let inner = l.match(/Vider\.WriteLine\("(.*)"\)/)[1];
                    for (let t = 0; t < times; t++) {
                        for (let v of viderIndex) {
                            con.innerHTML += `<div style="color:#00ffff;">[VAL]: ${inner.replace("Index", v)}</div>`;
                            await sleep(10);
                        }
                    }
                    continue;
                }
                if (l === "SENT") con.innerHTML += `<div style="color:lime; font-weight:bold;">SENT</div>`;

            } catch (e) {
                con.innerHTML += `<div style="color:red">[ERR] L:${lineNum}: ${e.message}</div>`;
            }
        }
    };

    // --- FUNKCJA RESETU (Dostępna globalnie przez window) ---
    window.resetCode = function() {
        if (confirm("Czy na pewno chcesz wyczyścić cały kod? Tej operacji nie da się cofnąć!")) {
            localStorage.removeItem('vider_autosave');
            edit.value = "";
            scene.innerHTML = '';
            con.innerHTML = '';
        }
    };
};