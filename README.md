# ISSP2023-PlaceSpeak

This setup process only works for Windows machines. Other operating systems will have to find alternatives for OSGeo4W.
# Clone the repository

1. Create a new folder and open this folder with VS Code
2. Clone the repository
```
git clone https://github.com/OggieBoggie/ISSP2023-PlaceSpeak PlaceSpeak
```
3. Change directory into repo and initialize git
```
git init
```
# Create a Virtual Environment (Optional)

1. Change directory to folder containing repo
2. Create a virtual environment
```
python -m venv env
```
3. Activate Virtual Environment
```
./env/scripts/Activate.ps1
```

# Download Dependencies

## Install Node.js

1. Download setup at https://nodejs.org/en

## Install Python Modules

1. Launch your virtual environment or open up your folder containing the PlaceSpeak repo
2. Change your directory to /myproject
3. Run the command
```
pip install -r ./requirements.txt
```
## Install OSGeo4W

1. Download the setup at https://trac.osgeo.org/osgeo4w/
2. Start the setup and do express install
3. On select packages, install GDAL
4. Accept terms and finish installation
5. Add another line to Django settings at the bottom of`<repo>/myproject/myproject/settings.py
```
...
GEOS_LIBRARY_PATH = r'C:\OSGeo4W\bin\geos_c.dll'
...
```

## Install PostgreSQL and PostGIS

1. Download Postgres Version 16 at https://www.postgresql.org/download/
2. Set password to "Password"
4. Leave port as default (5432)
5. Keep clicking next and leave everything as default until installation.
6. After installation press yes to launch stackbuilder
7. Select PostGIS under 'Spatial Extensions'
8. Click Next and don't skip installations
9. Install PostGIS

# Set up PostgreSQL database

1. Try to connect to Postgres server in command prompt or powershell
```
psql -U postgres
```

If you can't connect, open up command prompt/powershell and change directories to your postgres installation.

`c:\Program Files\PostgreSQL\16\bin`

```
psql.exe -U postgres
```

2. Enter the password that you chose at PostgreSQL installation. 
	should be "Password" if you set it default

3. Set up the database. run these commands in order *note: change the direct location to your installation of myproject. This SQL file is located in repo/myproject*
```
CREATE DATABASE inventory;
\c inventory;
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
\q
```

4. Import testing neighbourhoods
```
psql.exe -U postgres -d inventory -f <repo myproject directory>/create_van_nbhd.sql
psql.exe -U postgres -d inventory -f <repo myproject directory>/create_ca_nbhd.sql
```

# Make Migrations

1. Set directory to `<repo>/myproject`

run these commands
```
python ./manage.py makemigrations
python ./manage.py migrate
python ./manage.py runserver
```

# Install Next.js App

1. Set directory to `<repo>/mynextapp`

run these commands
```
npm install
npm run dev
```

# Set up OAuth

Our development environment takes advantage of OAuth and NextAuth.js with using a Google email to login. You'll need to create a new project at https://console.cloud.google.com/ such as

![](./images/Pasted%20image%2020231127005759.png)

Create an OAuth Client ID under API & Services > Credentials and configure your OAuth consent as an external type. Fill in the details App Name: `PlaceSpeak-Development` and fill in your email to `User Support Email` and `Developer Contact Information` and click `Save and Continue`

Head back into the Credential Screen and createn an OAuth Client ID with application type `Web Application`

Fill in the information so it's the same as this.

![](./images/Pasted%20image%2020231127015826.png)

Generate a NextAuth secret with openSSL on either Linux or Windows

```
openssl rand -base64 32
```

In the root folder of mynextapp create a new file called .env.local and fill in these details

```tsx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=<REPLACE WITH GOOGLE CLIENT ID CREATED AFTER CREATING WEB APP>
GOOGLE_CLIENT_SECRET=<REPLACE WITH GOOGLE CLIENT SECRET CREATED AFTER CREATING WEB APP>
```

# Done

Try to navigate to http://127.0.0.1:3000/ca_nbhd
