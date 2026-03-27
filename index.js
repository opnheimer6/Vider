window.onload = function() {
    const btn = document.getElementById('btn-on');
    const scene = document.getElementById('v-scene');
    const con = document.getElementById('v-console');
    const edit = document.getElementById('vider-editor'); 
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const savedCode = localStorage.getItem('vider_autosave');
    if (savedCode) { edit.value = savedCode; }

    edit.addEventListener('input', () => {
        localStorage.setItem('vider_autosave', edit.value);
    });

    btn.onclick = async function() {
        scene.innerHTML = ''; 
        con.innerHTML = '<div style="color:#555">-- Vider v3.5 [LISTS ENABLED] --</div>';
        
        const lines = edit.value.split('\n');
        let viderMemory = {}; 
        let viderLists = {}; // Pamięć dla list
        let viderIndex = [];
        let tableRef = null;
        let lineNum = 0;

        for (let line of lines) {
            lineNum++;
            let l = line.trim();
            if (!l || l.startsWith("//")) continue;

            try {
                // --- 1. MODUŁ LIST (MUSI BYĆ PRZED PODMIANĄ ZMIENNYCH) ---
                if (l.startsWith("list.create")) {
                    let listName = l.match(/\$\w+\$/)[0];
                    viderLists[listName] = [];
                    con.innerHTML += `<div style="color:#ff00ff">[LIST]: ${listName} created.</div>`;
                    continue;
                }

                if (l.startsWith("list.add")) {
                    let val = l.match(/\("(.*?)"\)/)[1];
                    let listName = l.match(/into\s+(\$\w+\$)/)[1];
                    if (viderLists[listName]) viderLists[listName].push(val);
                    continue;
                }

                if (l.startsWith("list.get")) {
                    let parts = l.match(/list\.get\s+(\$\w+\$)\s+\((\d+)\)\s+INTO\s+(\$\w+\$)/);
                    if (parts) {
                        let [_, lName, idx, tVar] = parts;
                        if (viderLists[lName] && viderLists[lName][idx] !== undefined) {
                            viderMemory[tVar] = viderLists[lName][idx];
                            con.innerHTML += `<div style="color:#ff00ff">[LIST]: ${tVar} = ${viderMemory[tVar]}</div>`;
                        }
                    }
                    continue;
                }

                // --- 2. PODMIANA ZMIENNYCH ---
                for (let key in viderMemory) {
                    l = l.split(key).join(viderMemory[key]);
                }

                // --- 3. TWOJA ORYGINALNA LOGIKA (TABELE, REPEAT, ITD.) ---
                
                // Poprawiony warunek tabeli (szuka frazy, nie tylko zmiennej)
                if (l.includes("Table Create")) {
                    tableRef = document.createElement('table');
                    tableRef.style.width = "100%";
                    tableRef.style.borderCollapse = "collapse";
                    tableRef.style.marginTop = "10px";
                    scene.appendChild(tableRef);
                    continue;
                }

                if (l.startsWith("<") && l.endsWith(">")) {
                    let type = l.substring(1, 4);
                    let contentMatch = l.match(/<(?:col|imp|ims)\s+(.*)>/);
                    if (contentMatch) {
                        let cells = contentMatch[1].split(",").map(c => c.trim().replace(/"/g, ""));
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

                if (l.startsWith("ask.") && l.endsWith(",")) {
                    let content = l.substring(4, l.length - 1).trim();
                    let varName = content.match(/\$\w+\$/)[0];
                    let question = content.match(/"(.*?)"/)[1];
                    viderMemory[varName] = prompt(question); 
                    con.innerHTML += `<div style="color:#00aaff">[INPUT]: ${varName} OK.</div>`;
                    continue;
                }

                if (l.startsWith("set.") && l.endsWith(",")) {
                    let content = l.substring(4, l.length - 1).trim();
                    let [vName, vVal] = content.split("=").map(s => s.trim());
                    if (vVal.includes("random")) {
                        let r = vVal.match(/\((.*?)\)/)[1].split(",").map(n => parseInt(n.trim()));
                        viderMemory[vName] = Math.floor(Math.random() * (r[1] - r[0] + 1)) + r[0];
                    } else {
                        viderMemory[vName] = vVal;
                    }
                    continue;
                }

                if (l.startsWith("Vider on print")) {
                    let txt = l.match(/\("(.*)"\)/);
                    if (txt) con.innerHTML += `<div style="color:white">> ${txt[1]}</div>`;
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

    window.resetCode = function() {
        if (confirm("Reset?")) {
            localStorage.removeItem('vider_autosave');
            location.reload();
        }
    };
};
