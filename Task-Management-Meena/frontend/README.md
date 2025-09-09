Hi Very Good Morning, 

Apologies I couldn't submit on Timeline cause My System is acting very slow after connecting to docker but for now i shared my GitHub repo showing my progress ..Please check .

My Approach was breaking the complex problem into Subproblems and solving each problem step by step  and prompting ChatGPT  ( AI tool used ) . later i felt i should have tried lovable it would have been easy 

Created Folder structure as instructed saying Main folder with my name 

Task-Management-Meena/
├── backend/ (npm run dev)
├── frontend/ (npm start)

Implemented Auth ( Login / SignUp ) layer and backend API's used Postman to test 

Added extra columns for table Users :- QUERY 

ALTER TABLE users
ADD COLUMN password VARCHAR(255) NOT NULL,
ADD COLUMN profile_url TEXT,
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user'));


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,        -- optional
    profile_url TEXT,                       -- optional
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_by INTEGER REFERENCES users(id) NOT NULL,
    attachments TEXT[],                     -- array of URLs / file paths
    progress INT CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_checklist (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    text VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

GitHub Repo :- https://github.com/meena-h/sde-assessment-test  

Thanks 
Meena H .


