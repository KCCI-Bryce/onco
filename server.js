const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./serverconnection');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.'));

// Test database connection
app.get('/test-connection', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT 1 as test');
        res.json({ status: 'success', message: 'Connected to database', data: result });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Handle Assessment Form submission
app.post('/submit-assessment', async (req, res) => {
    try {
        const { name, age, sex, idNum, hospitalNumber, homeAddress, chiefComplaint } = req.body;
        
        const query = `
            INSERT INTO AssessmentForms 
            (PatientName, Age, Sex, IDNum, HospitalNumber, HomeAddress, ChiefComplaint, SubmittedDate)
            VALUES 
            (@name, @age, @sex, @idNum, @hospitalNumber, @homeAddress, @chiefComplaint, GETDATE())
        `;
        
        const result = await pool.request()
            .input('name', name)
            .input('age', age)
            .input('sex', sex)
            .input('idNum', idNum)
            .input('hospitalNumber', hospitalNumber)
            .input('homeAddress', homeAddress)
            .input('chiefComplaint', chiefComplaint)
            .query(query);
        
        res.json({ status: 'success', message: 'Assessment form submitted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Handle Consent to Anesthesia submission
app.post('/submit-consent', async (req, res) => {
    try {
        const { patientName, physicianName, guardianName } = req.body;
        
        const query = `
            INSERT INTO ConsentForms 
            (PatientName, PhysicianName, GuardianName, SubmittedDate)
            VALUES 
            (@patientName, @physicianName, @guardianName, GETDATE())
        `;
        
        const result = await pool.request()
            .input('patientName', patientName)
            .input('physicianName', physicianName)
            .input('guardianName', guardianName)
            .query(query);
        
        res.json({ status: 'success', message: 'Consent form submitted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Handle CT Simulation submission
app.post('/submit-ctsimulation', async (req, res) => {
    try {
        const { patientName, treatmentTechnique, procedures } = req.body;
        
        const query = `
            INSERT INTO CTSimulationForms 
            (PatientName, TreatmentTechnique, Procedures, SubmittedDate)
            VALUES 
            (@patientName, @treatmentTechnique, @procedures, GETDATE())
        `;
        
        const result = await pool.request()
            .input('patientName', patientName)
            .input('treatmentTechnique', treatmentTechnique)
            .input('procedures', procedures)
            .query(query);
        
        res.json({ status: 'success', message: 'CT Simulation form submitted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Generic form submission endpoint
app.post('/submit-form', async (req, res) => {
    try {
        const formData = req.body;
        const formType = req.body.formType || 'General';
        
        const query = `
            INSERT INTO FormSubmissions 
            (FormType, FormData, SubmittedDate)
            VALUES 
            (@formType, @formData, GETDATE())
        `;
        
        const result = await pool.request()
            .input('formType', formType)
            .input('formData', JSON.stringify(formData))
            .query(query);
        
        res.json({ status: 'success', message: 'Form submitted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Retrieve form data
app.get('/get-forms/:formType', async (req, res) => {
    try {
        const formType = req.params.formType;
        
        const result = await pool.request()
            .input('formType', formType)
            .query('SELECT * FROM FormSubmissions WHERE FormType = @formType ORDER BY SubmittedDate DESC');
        
        res.json({ status: 'success', data: result.recordset });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║  Oncology Form Server Running!         ║
    ║  http://localhost:${PORT}              ║
    ║  Database: ONCOLOGY                    ║
    ╚════════════════════════════════════════╝
    `);
    console.log('Available endpoints:');
    console.log('  GET  http://localhost:3000/test-connection');
    console.log('  POST http://localhost:3000/submit-form');
    console.log('  POST http://localhost:3000/submit-assessment');
    console.log('  GET  http://localhost:3000/get-forms/:formType');
});
