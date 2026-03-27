window.onload = function() {
    const btn = document.getElementById('btn-on');
    const scene = document.getElementById('v-scene');
    const con = document.getElementById('v-console');
    const edit = document.getElementById('vider-editor'); 
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Sprawdź czy elementy w ogóle istnieją
    if (!btn) { console.error("FATAL: Nie znaleziono przycisku 'btn-on'!"); return; }

    const savedCode = localStorage.getItem('vider_autosave');
    if (savedCode) { edit.value = savedCode; }

    edit.addEventListener('input', () => {
        localStorage.setItem('vider_autosave', edit.value);
    });

    btn.onclick = async function() {
        console.log("Przycisk kliknięty!"); // To MUSI się pojawić w F12
        btn.disabled = true; // Blokada, żeby nie zepsuć async
        
        try {
            scene.innerHTML = ''; 
            con.innerHTML = '<div style="color:#555">-- Vider v3.6 [SYNC FIXED] --</div>';
            
            const lines = edit.value.split('\n');
            let viderMemory = {}; 
            let viderLists = {}; 
            let viderIndex = [];
            let tableRef = null;
            let lineNum = 0;

            for (let line of lines) {
                lineNum++;
                let l = line.trim();
                if (!l || l.startsWith("//")) continue;

                // --- 1. MODUŁ LIST ---
                if (l.startsWith("list.create")) {
                    let m = l.match(/\$\w+\$/);
                    if (m) {
                        viderLists[m[0]] = [];
                        con.innerHTML += `<div style="color:#ff00ff">[LIST]: ${m[0]} created.</div>`;
                    }
                    continue;
                }

                if (l.startsWith("list.add")) {
                    let valMatch = l.match(/\("(.*?)"\)/);
                    let listMatch = l.match(/into\s+(\$\w+\$)/);
                    if (valMatch && listMatch) {
                        let listName = listMatch[1];
                        if (viderLists[listName]) viderLists[listName].push(valMatch[1]);
                    }
                    continue;
                }

                if (l.startsWith("list.get")) {
                    // Poprawione dopasowanie (ignoruje wielkość liter INTO)
                    let parts = l.match(/list\.get\s+(\$\w+\$)\s+\((\d+)\)\s+(?:into|INTO)\s+(\$\w+\$)/);
                    if (parts) {
                        let [_, lName, idx, tVar] = parts;
                        if (viderLists[lName] && viderLists[lName][idx] !== undefined) {
                            viderMemory[tVar] = viderLists[lName][idx];
                        }
                    }
                    continue;
                }

                // --- 2. PODMIANA ZMIENNYCH ---
                for (let key in viderMemory) {
                    l = l.split(key).join(viderMemory[key]);
                }

                // --- 3. LOGIKA WYŚWIETLANIA ---
                if (l.includes("Table Create")) {
                    tableRef = document.createElement('table');
                    tableRef.style.cssText = "width:100%; border-collapse:collapse; margin-top:10px; color:white;";
                    scene.appendChild(tableRef);
                    continue;
                }

                if (l.startsWith("<") && l.endsWith(">")) {
                    let type = l.substring(1, 4);
                    let contentMatch = l.match(/<(?:col|imp|ims)\s+(.*)>/);
                    if (contentMatch && tableRef) {
                        let cells = contentMatch[1].split(",").map(c => c.trim().replace(/"/g, ""));
                        let row = document.createElement('tr');
                        cells.forEach(c => {
                            let td = document.createElement('td');
                            td.innerText = c;
                            td.style.cssText = "border:1px solid white; padding:8px;";
                            if (type === "col") { td.style.backgroundColor = "#333"; td.style.fontWeight = "bold"; }
                            row.appendChild(td);
                        });
                        type === "col" ? tableRef.prepend(row) : tableRef.appendChild(row);
                    }
                    continue;
                }

                if (l.startsWith("Vider on print")) {
                    let txt = l.match(/\("(.*)"\)/);
                    if (txt) {
                        let msg = document.createElement('div');
                        msg.style.cssText = "color:white; font-size:18px; margin-bottom:5px;";
                        msg.innerText = "> " + txt[1];
                        scene.appendChild(msg);
                    }
                    continue;
                }

                if (l === "SENT") con.innerHTML += `<div style="color:lime; font-weight:bold;">SENT</div>`;

            }
        } catch (e) {
            console.error("Błąd wykonania:", e);
            con.innerHTML += `<div style="color:red">[ERR] L:${lineNum}: ${e.message}</div>`;
        }
        btn.disabled = false;
    };

    window.resetCode = function() {
        if (confirm("Reset?")) {
            localStorage.removeItem('vider_autosave');
            location.reload();
        }
    };
};
