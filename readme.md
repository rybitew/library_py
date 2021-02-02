# Library Manager
Projekt wykorzystuje Django i Django Rest Framework do komunikacji między front- i back-endem. Aplikacja webowa została napisana z wykorzystaniem frameworka Angular.
Aplikacja służy do zarządzania inwentarzem sieci bibliotek. Pozwala na operacje takie jak dodawanie, usuwanie i edycję książek, wraz z określeniem ich lokalizacji. Aplikacja zawiera dodatkowo mapę lokalizacji bibliotek, wraz z możliwością dodawania nowych.

# Uruchamianie
Projekt wymaga zainstalowanego NPM, Python i instalatora pakietów PIP.
### Backend
Aby zainstalować niezbędne pakiety należy w głównym folderze należy uruchomić komendę:
`pip install -r requirements.txt`
Następnie uruchomić:
```
python manage.py migrate
python manage.py runserver
```
Backend zostanie uruchomiony na porcie **8000**.
### Frontend
Należy przejść do folderu **library-web** i zainstalować zależności poleceniem:
`npm install`
Następnie uruchomić aplikację za pomocą:
`npm start`
Aplikacja zostanie uruchomiona na porcie **4200**.


## API
### Backend
Bazowo zapytania wysyłane są do `http://localhost:8000/`.
| Ścieżka | Metody | Parametry / Ciało | Działanie|
|:--------------:|:----------------:|:---:|:--------:|
 api/book/all | GET || Zwraca wszystkie książki.
api/book/manage|POST / PUT / DELETE|BookDto| Dodaje / aktualizuje / usuwa książkę (w tym dodaje autora jeśli ten nie istnieje), jeśli po aktualizacji albo usunięciu książki autor nie posiada żadnych książek, zostaje on usunięty. Wymaga zalogowanego użytkownika.
 api/book | GET|author / id / title|Zwraca wszystkie książki o podanym ID, autorze lub tytule.
api/account/login|POST|LoginDto|Loguje użytkownika o podanym haśle i loginie, zwraca token JWT jeśli dane są poprawne.
api/account/register|POST|RegisterDto|Dodaje użytkownika o podanym haśle, loginie i adresie e-mail, login i adres muszą być unikalne. Zwraca token JWT jeśli rejestracja się powiodła.
api/location/all|GET||Zwraca wszystkie lokalizacje bibliotek.
api/location|POST|LibraryLocationDto|Dodaje lokalizację biblioteki. Wymaga zalogowanego użytkownika.
#### POST 
Ciała zapytań POST:
```
BookDto {  
  id: number;  
  title: string;  
  genre: string;  
  authors: string[];  
  published: Date;  
  library?: LibraryLocationDto;  
}
LibraryLocationDto {  
  placeId: number;  
  longitude: number;  
  latitude: number;  
  name: string;  
  displayedAddress: string;  
}
LoginDto {  
  username: string;  
  password: string;  
}
RegisterDto {  
  username: string;  
  password: string;  
  email: string;  
}
```

### Frontend
Aplikacja webowa wysyła zapytania do aplikacji serwerowej i do API OpenStreetMap. Zapytania wysyłane do aplikacji serwerowej zostały wymienione powyżej, te wysyłane do OpenStreetMap zostały przedstawione w tabeli.
| Ścieżka | Metody | Parametry / Ciało | Działanie|
|:--------------:|:----------------:|:---:|:--------:|
|https://nominatim.openstreetmap.org/search?format=json&limit=3&q=| GET |adres (np. Gliwice, Akademicka 16)|Zwraca dane geograficzne (takie jak długość i szerokość geograficzna, pełna nazwa i ID miejsca) dla wszystkich lokalizacji z podanym adresem.
|https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?outSR=4326&returnIntersection=false&location= [lat, lon] &f=json |GET| długość i szerokość geograficzna: 21.064,52.356 | Zwraca adres miejsca o podanej długości i szerokości geograficznej|