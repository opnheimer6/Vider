📑 SŁOWNIK KOMEND VIDER v3.4
1. <col (Kolumny/Nagłówek)

Opis: Tworzy pierwszy, wyróżniony wiersz tabeli.


Kod: <col "Nazwa", "Ilość", "Typ" >
2. <imp (Dane Górne)

Opis: Wpisuje wiersz danych do głównej sekcji tabeli.


Kod: <imp "Miecz", "1", "Broń" >

3. <ims (Dane Dolne)

Opis: Wpisuje wiersz danych na samym dole tabeli (np. podsumowanie).


Kod: <ims "RAZEM", "100", "Suma" >

4. set. (Zmienne)

Opis: Zapamiętuje wartość pod daną nazwą. Wymaga przecinka na końcu.


Kod: set. $KASA$ = 500,

5. ask. (Interakcja)

Opis: Wyświetla okno do wpisania tekstu przez użytkownika. Wymaga przecinka.


Kod: ask. $LOGIN$ ("Podaj nick:"),

6. random (Losowanie)

Opis: Losuje liczbę z zakresu. Używane wewnątrz set..


Kod: set. $DROP$ = random(1, 10),

7. sum (Matematyka)

Opis: Wykonuje obliczenia na liczbach lub zmiennych.


Kod: sum($HP$ - 20)

8. [] color. (Kolorowanie)

Opis: Zmienia kolor tekstu w tabeli. Wymaga przecinka.


Kod: [] color.("Miecz") = cyan,
9. Vider on print (Tekst)

Opis: Wypisuje biały tekst w konsoli.


Kod: Vider on print ("Witaj $LOGIN$")

10. task.wait (Czas)

Opis: Robi przerwę w działaniu programu (w sekundach). Wymaga przecinka.


Kod: task.wait(2),

11. Table Create on $UNO$

Opis: Startuje budowę nowej tabeli w oknie wizualizacji.


Kod: Table Create on $UNO$

12. SENT

Opis: Obowiązkowe zakończenie każdego skryptu.


Kod: SENT
🔄 PĘTLE I LICZNIKI (Automatyzacja)
11. Create Index of (Przygotowanie listy)

Opis: Tworzy niewidzialną listę liczb od 0 do podanej wartości. Musi być wywołana przed pętlą Repeat. Wymaga przecinka.


Kod: Create Index of (5),


Co to robi: Przygotowuje liczby: 0, 1, 2, 3, 4, 5.

12. Repeat (Pętla Vider.WriteLine)

Opis: Powtarza czynność tyle razy, ile wpiszesz w pierwszym nawiasie. Słowo Index wewnątrz komendy zostanie automatycznie zamienione na kolejną liczbę z Twojej listy.


Kod: Repeat (1) (Vider.WriteLine("Wartość: Index"))


Co to robi: Wypisze w konsoli:

o
[VAL]: Wartość: 0


[VAL]: Wartość: 1


... i tak do końca indeksu.

