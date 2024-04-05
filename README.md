# OnlyNotes

## Instalacja

- Pobierz minio ze strony min.io
- Uruchom minio za pomocą komendy `.\minio.exe server start object storage server`
  - Utwórz bucket o nazwie only-notes
  - Ustaw dostępność bucketa na public
  - Utwórz access key
  - Przepisz otrzymane informacje do pliku .env w następujący sposób
    `S3_URL="http://127.0.0.1:9000"`
    `S3_ACCESS_KEY="klucz z wyżej"`
    ` S3_SECRET_KEY="secret z wyżej"`
    `S3_BUCKET_NAME="only-notes"`
- Uruchom XAMPP, lub inny serwer MySQL
  - Utwórz bazę danych o nazwie only-notes
  - Umieść connection string w `.env` w następujący sposób `DATABASE_URL="mysql://root:@localhost:3306/only_notes"`
- Otwórz platformę azure w celu ustawienia uwieżytelniania użytkowników
  - Wejdź na azure entra ID, po czym na aplikacje
  - utwórz nową aplikację
  - dodaj identyfikatory URI przekierowania do aplikacji
    - `http://localhost:3000/`
    - `http://localhost:3000/api/auth/callback/azure-ad`
  - wpisz klucze z azure do pliku `.env`
    - `AZURE_AD_CLIENT_ID="identyfikator klienta"`
    - `AZURE_AD_CLIENT_SECRET="poświadczenie tajne (trzeba dodać)"`
    - `AZURE_AD_TENANT_ID="identyfikator katalogu"`
- Uruchom `pnpm db:push`, aby zsynchronizować bazę danych z plikiem schema.prisma
- Uruchom `pnpm i`, aby zainstalować moduły
- Uruchom `pnpm dev`, aby uruchomić projekt

## Używane biblioteki

- shadcn/ui
- react
- nextjs (pages router)
- nextauth
- t3app
- prisma
- trpc
- tailwindcss

## Struktura aplikacji

- @ - tu znajdują się komponenty ui biblioteki shadcn/ui, aby je pobierać należy używać narzędzia cli dostępnego na https://ui.shadcn.com/.
- prisma - tu znajduje się schemat bazy danych, aby zmienić strukturę danych, należy edytować schemat.
- public - tu znajdują się publicznie dostępne statyczne pliki na stronie
- src - tu znajduje się cały kod aplikacji
  - components - tu znajdują się reactowe komponenty, które tworzą strony
  - pages - tu znajdują się strony routera nextjs
  - server - tu znajduję się backend
    - api - tu znajdują się routery do funkcji na backendzie, aby zapoznać się z działaniem należy zapoznać się z dokumentacją trpc https://trpc.io
    - s3 - folder i plik potrzebny do prawidłowego działania uploadu zdjęć do serwera plików
    - auth.ts - plik z opcjami i callbackami uwieżytelniania nextauth, aby zapoznać się z działaniem, przeczytać dokumentację https://authjs.dev/
  - .env - tu znajdują się zmienne środowiskowe, powinny być ściśle tajne, należy go stworzyć
  - reszta plików to konfiguracje poszczególnych bibliotek
