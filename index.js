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
        btn.disabled = true;
        scene.innerHTML = ''; 
        con.innerHTML = '<div style="color:#555">-- Vider v3.9 [FINAL STABLE] --</div>';
        
        const lines = edit.value.split('\n');
        let viderMemory = {}; 
        let viderLists = {}; 
        let tableRef = null;
        let lineNum = 0;

        for (let line of lines) {
            lineNum++;
            let l = line.trim();
            if (!l || l.startsWith("//")) continue;

            try {
                let low = l.toLowerCase();

                // 1. LISTY
                if (low.startsWith("list.create")) {
                    let m = l.match(/\$\w+\$/);
                    if (m) {
                        viderLists[m[0]] = [];
                        con.innerHTML += `<div style="color:#ff00ff">[LIST]: ${m[0]} OK</div>`;
                    }
                    continue;
                }

                if (low.startsWith("list.add")) {
                    let valMatch = l.match(/\("(.*?)"\)/);
                    let listMatch = l.match(/into\s+(\$\w+\$)/i);
                    if (valMatch && listMatch) {
                        let listName = listMatch[1];
                        if (!viderLists[listName]) viderLists[listName] = [];
                        viderLists[listName].push(valMatch[1]);
                        con.innerHTML += `<div style="color:#ff00ff">[ADD]: ${valMatch[1]} -> ${listName}</div>`;
                    }
                    continue;
                }

                if (low.startsWith("list.get")) {
                    // Poprawione na ignorowanie wielkości liter w "into"
                    let parts = l.match(/list\.get\s+(\$\w+\$)\s+\((\d+)\)\s+into\s+(\$\w+\$)/i);
                    if (parts) {
                        let [_, lName, idx, tVar] = parts;
                        let index = parseInt(idx);
                        if (viderLists[lName] && viderLists[lName][index] !== undefined) {
                            viderMemory[tVar] = viderLists[lName][index];
                            con.innerHTML += `<div style="color:#ff00ff">[GET]: ${tVar} = ${viderMemory[tVar]}</div>`;
                        }
                    }
                    continue;
                }

                // 2. PODMIANA ZMIENNYCH (Dla printów i tabel)
                let processedLine = l;
                for (let key in viderMemory) {
                    processedLine = processedLine.split(key).join(viderMemory[key]);
                }

                // 3. WYŚWIETLANIE NA SCENIE (GÓRA)
                if (low.startsWith("vider on print")) {
                    let txt = l.match(/\("(.*)"\)/);
                    if (txt) {
                        let content = txt[1];
                        // Podmiana zmiennych przed wyświetleniem
                        for (let key in viderMemory) {
                            content = content.split(key).join(viderMemory[key]);
                        }
                        let msg = document.createElement('div');
                        msg.style.cssText = "color:white; font-size:20px; margin-bottom:5px;";
                        msg.innerText = "> " + content;
                        scene.appendChild(msg);
                    }
                    continue;
                }

                // 4. LOGIKA POZOSTAŁA
                if (processedLine.includes("Table Create")) {
                    tableRef = document.createElement('table');
                    tableRef.style.cssText = "width:100%; border-collapse:collapse; margin-top:10px;";
                    scene.appendChild(tableRef);
                    continue;
                }

                if (processedLine.startsWith("<") && processedLine.endsWith(">")) {
                    let type = processedLine.substring(1, 4);
                    let contentMatch = processedLine.match(/<(?:col|imp|ims)\s+(.*)>/);
                    if (contentMatch) {
                        let cells = contentMatch[1].split(",").map(c => c.trim().replace(/"/g, ""));
                        let row = document.createElement('tr');
                        cells.forEach(c => {
                            let td = document.createElement('td');
                            td.innerText = c;
                            td.style.cssText = "border:1px solid white; padding:8px; color:white;";
                            if (type === "col") { td.style.backgroundColor = "#333"; td.style.fontWeight = "bold"; }
                            row.appendChild(td);
                        });
                        if (tableRef) type === "col" ? tableRef.prepend(row) : tableRef.appendChild(row);
                    }
                    continue;
                }

                if (low.startsWith("set.")) {
                    let content = l.substring(4).replace(",", "").trim();
                    let parts = content.split("=");
                    if(parts.length === 2) {
                        let vName = parts[0].trim();
                        let vVal = parts[1].trim();
                        if (vVal.includes("random")) {
                            let r = vVal.match(/\((\d+),(\d+)\)/);
                            if(r) viderMemory[vName] = Math.floor(Math.random() * (parseInt(r[2]) - parseInt(r[1]) + 1)) + parseInt(r[1]);
                        } else {
                            viderMemory[vName] = vVal.replace(/"/g, "");
                        }
                    }
                    continue;
                }

                if (low === "sent") con.innerHTML += `<div style="color:lime; font-weight:bold;">SENT</div>`;

            } catch (e) {
                con.innerHTML += `<div style="color:red">[ERR] L:${lineNum}: ${e.message}</div>`;
            }
        }
        btn.disabled = false;
    };

    window.resetCode = function() {
        if (confirm("Reset?")) { localStorage.removeItem('vider_autosave'); location.reload(); }
    };
};
