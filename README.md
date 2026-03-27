🚀 VIDER COMMAND DICTIONARY v3.4 (EN)
1. <col (Columns/Header) Opis: Creates the first, highlighted row of the table.

Kod: <col "Name", "Quantity", "Type" >

2. <imp (Upper Data) Opis: Inserts a data row into the main section.

Kod: <imp "Sword", "1", "Weapon" >

3. <ims (Bottom Data) Opis: Inserts a data row at the very bottom.

Kod: <ims "TOTAL", "100", "Sum" >

4. set. (Variables) Opis: Stores a value. Requires a comma at the end.

Kod: set. $CASH$ = 500,

5. ask. (Interaction) Opis: Displays a window for user text input. Requires a comma.

Kod: ask. $LOGIN$ ("Enter nick:"),

6. random (Randomizer) Opis: Picks a random number. Used inside set..

Kod: set. $DROP$ = random(1, 10),

7. sum (Mathematics) Opis: Performs calculations on numbers or variables.

Kod: sum($HP$ - 20)

8. [] color. (Coloring) Opis: Changes the text color. Requires a comma.

Kod: [] color.("Sword") = cyan,

9. Vider on print (Text) Opis: Prints white text in the console.

Kod: Vider on print ("Welcome $LOGIN$")

10. task.wait (Time) Opis: Pauses the program. Requires a comma.

Kod: task.wait(2),

11. Table Create on $UNO$ Opis: Starts building a new table.Kod: Table Create on $UNO$

12.  SENT Opis: Mandatory ending for every script.Kod: SENT
    
 13. Create Index of (Preparation) Opis: Creates a list of numbers from 0 to X. Requires a comma.

Kod: Create Index of (5),

14. Repeat (Loop) Opis: Repeats an action. "Index" is replaced by numbers.

Kod: Repeat (1) (Vider.WriteLine("Value: Index"))


🚀 SŁOWNIK KOMEND VIDER v3.4 (PL)
1. <col (Kolumny/Nagłówek) Opis: Tworzy pierwszy, wyróżniony wiersz tabeli.

Kod: <col "Nazwa", "Ilość", "Typ" >

2. <imp (Dane Górne) Opis: Wpisuje wiersz danych do głównej sekcji tabeli.

Kod: <imp "Miecz", "1", "Broń" >

3. <ims (Dane Dolne) Opis: Wpisuje wiersz danych na samym dole tabeli.

Kod: <ims "RAZEM", "100", "Suma" >

4. set. (Zmienne) Opis: Zapamiętuje wartość. Wymaga przecinka na końcu.

Kod: set. $KASA$ = 500,

5. ask. (Interakcja) Opis: Wyświetla okno do wpisania tekstu. Wymaga przecinka.

Kod: ask. $LOGIN$ ("Podaj nick:"),

6. random (Losowanie) Opis: Losuje liczbę z zakresu. Używane wewnątrz set..

Kod: set. $DROP$ = random(1, 10),

7. sum (Matematyka) Opis: Wykonuje obliczenia na liczbach lub zmiennych.

Kod: sum($HP$ - 20)

8. [] color. (Kolorowanie) Opis: Zmienia kolor tekstu. Wymaga przecinka.

Kod: [] color.("Miecz") = cyan,

9. Vider on print (Tekst) Opis: Wypisuje biały tekst w konsoli.

Kod: Vider on print ("Witaj $LOGIN$")

10. task.wait (Czas) Opis: Robi przerwę w działaniu. Wymaga przecinka.Kod: task.wait(2),
    
11. Table Create on $UNO$ Opis: Startuje budowę nowej tabeli.Kod: Table Create on $UNO$

12. SENT Opis: Obowiązkowe zakończenie każdego skryptu.

Kod: SENT

13. Create Index of (Przygotowanie listy) Opis: Tworzy listę liczb od 0 do X. Wymaga przecinka.

Kod: Create Index of (5),

14. Repeat (Pętla) Opis: Powtarza czynność. "Index" jest zamieniany na liczby.

Kod: Repeat (1) (Vider.WriteLine("Wartość: Index"))
