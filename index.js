window.onload = function() {
    const btn = document.getElementById('btn-on');
    const scene = document.getElementById('v-scene');
    const con = document.getElementById('v-console');
    const edit = document.getElementById('vider-editor'); 

    btn.onclick = async function() {
        // 1. Czyścimy wszystko i blokujemy przycisk
        btn.disabled = true;
        scene.innerHTML = ''; 
        con.innerHTML = '<div style="color:#555">-- Vider v4.0 [REANIMACJA] --</div>';
        
        let viderMemory = {}; 
        let viderLists = {}; 
        let tableRef = null;

        const lines = edit.value.split('\n');

        for (let line of lines) {
            let l = line.trim();
            if (!l || l.startsWith("//")) continue;

            try {
                let low = l.toLowerCase();

                // --- OBSŁUGA LIST ---
                if (low.startsWith("list.create")) {
                    let m = l.match(/\$\w+\$/);
                    if (m) {
                        viderLists[m[0]] = [];
                        con.innerHTML += `<div style="color:#ff00ff">[LISTA]: Utworzono ${m[0]}</div>`;
                    }
                    continue;
                }

                if (low.startsWith("list.add")) {
                    let valMatch = l.match(/\("(.*?)"\)/);
                    let listMatch = l.match(/into\s+(\$\w+\$)/i);
                    if (valMatch && listMatch) {
                        let name = listMatch[1];
                        if (viderLists[name]) {
                            viderLists[name].push(valMatch[1]);
                            con.innerHTML += `<div style="color:#ff00ff">[LISTA]: Dodano do ${name}</div>`;
                        }
                    }
                    continue;
                }

                if (low.startsWith("list.get")) {
                    let parts = l.match(/list\.get\s+(\$\w+\$)\s+\((\d+)\)\s+into\s+(\$\w+\$)/i);
                    if (parts) {
                        let [_, lName, idx, tVar] = parts;
                        if (viderLists[lName] && viderLists[lName][parseInt(idx)] !== undefined) {
                            viderMemory[tVar] = viderLists[lName][parseInt(idx)];
                            con.innerHTML += `<div style="color:#ff00ff">[LISTA]: Pobrano ${tVar}</div>`;
                        }
                    }
                    continue;
                }

                // --- PODMIANA ZMIENNYCH ---
                for (let key in viderMemory) {
                    l = l.split(key).join(viderMemory[key]);
                }

                // --- WYŚWIETLANIE NA GÓRZE (SCENA) ---
                if (l.toLowerCase().startsWith("vider on print")) {
                    let txt = l.match(/\("(.*)"\)/);
                    if (txt) {
                        let msg = document.createElement('div');
                        msg.style.cssText = "color:white; font-size:18px; padding:2px;";
                        msg.innerText = "> " + txt[1];
                        scene.appendChild(msg);
                    }
                    continue;
                }

                // --- TABELE ---
                if (l.includes("Table Create")) {
                    tableRef = document.createElement('table');
                    tableRef.style.cssText = "width:100%; border-collapse:collapse; color:white; border:1px solid white; margin-top:5px;";
                    scene.appendChild(tableRef);
                    continue;
                }

                if (l.startsWith("<") && l.endsWith(">")) {
                    let type = l.substring(1, 4);
                    let content = l.match(/<(?:col|imp)\s+(.*)>/);
                    if (content && tableRef) {
                        let cells = content[1].split(",").map(c => c.trim().replace(/"/g, ""));
                        let row = document.createElement('tr');
                        cells.forEach(c => {
                            let td = document.createElement('td');
                            td.innerText = c;
                            td.style.border = "1px solid white";
                            td.style.padding = "5px";
                            row.appendChild(td);
                        });
                        tableRef.appendChild(row);
                    }
                    continue;
                }

                if (l === "SENT") con.innerHTML += `<div style="color:lime">ZAKOŃCZONO</div>`;

            } catch (err) {
                con.innerHTML += `<div style="color:red">BŁĄD: ${err.message}</div>`;
            }
        }
        btn.disabled = false;
    };
};
