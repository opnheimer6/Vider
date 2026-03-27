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
        // --- FUNDAMENTY VIDERA ---
        let viderMemory = {}; // Tu żyją Twoje zmienne ($NAME$, $LVL$)
        let viderLists = {};  // Tu żyją Twoje listy ($EQ$, $ITEMS$)
        let viderIndex = [];  // Tu żyje Twój Index do Repeat
        // -------------------------

        scene.innerHTML = ''; 
        con.innerHTML = '<div style="color:#555">-- Vider v3.6 [MEMORY FIXED] --</div>';
        
        const lines = edit.value.split('\n');
        let tableRef = null;
        let lineNum = 0;
                
                if (lineLower.includes("list.create")) {
                    alert("WYKRYTO CREATE!"); // TEST: Jeśli to nie wyskoczy, parser omija linię
                    let m = l.match(/\$\w+\$/);
                    if (m) {
                        viderLists[m[0]] = [];
                        con.innerHTML += `<div style="color:#ff00ff">[LIST]: ${m[0]} OK</div>`;
                    }
                    continue;
                }

                if (lineLower.includes("list.add")) {
                    let valMatch = l.match(/\("(.*?)"\)/);
                    let listMatch = l.match(/into\s+(\$\w+\$)/i);
                    if (valMatch && listMatch) {
                        if (!viderLists[listMatch[1]]) viderLists[listMatch[1]] = [];
                        viderLists[listMatch[1]].push(valMatch[1]);
                        con.innerHTML += `<div style="color:#ff00ff">[ADD]: ${valMatch[1]} -> ${listMatch[1]}</div>`;
                    }
                    continue;
                }

                if (lineLower.includes("list.get")) {
                    // Szukamy: list.get $EQ$ (0) INTO $VAR$
                    let parts = l.match(/list\.get\s+(\$\w+\$)\s+\((\d+)\)\s+into\s+(\$\w+\$)/i);
                    if (parts) {
                        let [_, lName, idx, tVar] = parts;
                        if (viderLists[lName] && viderLists[lName][parseInt(idx)] !== undefined) {
                            viderMemory[tVar] = viderLists[lName][parseInt(idx)];
                            con.innerHTML += `<div style="color:#ff00ff">[GET]: ${tVar} = ${viderMemory[tVar]}</div>`;
                        }
                    }
                    continue;
                }
        // Blokada przycisku, żeby nie kliknąć 10 razy naraz
        btn.disabled = true;
        scene.innerHTML = ''; 
        con.innerHTML = '<div style="color:#555">-- Vider v3.5 [STABLE] --</div>';
        
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

            try {
                // 1. LISTY
                if (l.startsWith("list.create")) {
                    let m = l.match(/\$\w+\$/);
                    if(m) { viderLists[m[0]] = []; con.innerHTML += `<div style="color:#ff00ff">[LIST]: ${m[0]} created.</div>`; }
                    continue;
                }
                if (l.startsWith("list.add")) {
                    let valMatch = l.match(/\("(.*?)"\)/);
                    let listMatch = l.match(/into\s+(\$\w+\$)/);
                    if (valMatch && listMatch && viderLists[listMatch[1]]) {
                        viderLists[listMatch[1]].push(valMatch[1]);
                    }
                    continue;
                }
                if (l.startsWith("list.get")) {
                    let parts = l.match(/list\.get\s+(\$\w+\$)\s+\((\d+)\)\s+INTO\s+(\$\w+\$)/);
                    if (parts) {
                        let [_, lName, idx, tVar] = parts;
                        if (viderLists[lName] && viderLists[lName][idx] !== undefined) {
                            viderMemory[tVar] = viderLists[lName][idx];
                        }
                    }
                    continue;
                }

                // 2. PODMIANA ZMIENNYCH
                for (let key in viderMemory) {
                    l = l.split(key).join(viderMemory[key]);
                }

                // 3. LOGIKA
                if (l.includes("Table Create")) {
                    tableRef = document.createElement('table');
                    tableRef.style.cssText = "width:100%; border-collapse:collapse; margin-top:10px;";
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
                            td.style.cssText = "border:1px solid white; padding:8px; color:white;";
                            if (type === "col") { td.style.backgroundColor = "#333"; td.style.fontWeight = "bold"; }
                            row.appendChild(td);
                        });
                        if (tableRef) type === "col" ? tableRef.prepend(row) : tableRef.appendChild(row);
                    }
                    continue;
                }

                if (l.startsWith("ask.")) {
                    let vName = l.match(/\$\w+\$/)[0];
                    let q = l.match(/"(.*?)"/)[1];
                    viderMemory[vName] = prompt(q);
                    continue;
                }

                if (l.startsWith("set.")) {
                    let content = l.substring(4).replace(",", "").trim();
                    let [vName, vVal] = content.split("=").map(s => s.trim());
                    if (vVal.includes("random")) {
                        let r = vVal.match(/\((\d+),(\d+)\)/);
                        if(r) viderMemory[vName] = Math.floor(Math.random() * (parseInt(r[2]) - parseInt(r[1]) + 1)) + parseInt(r[1]);
                    } else {
                        viderMemory[vName] = vVal;
                    }
                    continue;
                }

                if (l.startsWith("sum")) {
                    let expr = l.match(/\((.*)\)/)[1];
                    con.innerHTML += `<div style="color:#00ff00">RACHUNEK: ${eval(expr)}</div>`;
                    continue;
                }

                if (l.startsWith("Create Index of")) {
                    let num = parseInt(l.match(/\((\d+)\)/)[1]);
                    viderIndex = Array.from({length: num + 1}, (_, i) => i);
                    continue;
                }

                if (l.startsWith("Repeat")) {
                    let tMatch = l.match(/Repeat\s*\((\d+)\)/);
                    let iMatch = l.match(/Vider\.WriteLine\("(.*)"\)/);
                    if (tMatch && iMatch) {
                        let times = parseInt(tMatch[1]);
                        let inner = iMatch[1];
                        for (let t = 0; t < times; t++) {
                            // Zabezpieczenie: jeśli nie ma indexu, zrób chociaż jeden przebieg
                            let loopIdx = viderIndex.length > 0 ? viderIndex : [0];
                            for (let v of loopIdx) {
                                con.innerHTML += `<div style="color:#00ffff;">[VAL]: ${inner.replace("Index", v)}</div>`;
                                await sleep(5); // Krótki sleep, żeby nie zamrozić strony
                            }
                        }
                    }
                    continue;
                }

                if (l === "SENT") con.innerHTML += `<div style="color:lime; font-weight:bold;">SENT</div>`;

            } catch (e) {
                con.innerHTML += `<div style="color:red">[ERR] L:${lineNum}: ${e.message}</div>`;
            }
        }
        btn.disabled = false; // Odblokuj przycisk
    };

    window.resetCode = function() {
        if (confirm("Reset?")) { localStorage.removeItem('vider_autosave'); location.reload(); }
    };
};
