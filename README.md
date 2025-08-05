# Data Ingestion Application

A React-based web application for uploading, parsing, and ingesting CSV/Excel data into a Neon database via a Render API endpoint.

## 📋 Table of Contents

- [Operation](#operation)
- [Repair](#repair) 
- [Build](#build)
- [Troubleshoot](#troubleshoot)
- [Training](#training)

---

## 🚀 Operation

### What This Application Does

This application provides a complete data ingestion pipeline for marketing data:

1. **File Upload**: Upload CSV or Excel files containing company/people data
2. **Data Preview**: View parsed data in a table format before submission
3. **Data Ingestion**: Send data to Neon database via Render API
4. **API Testing**: Debug and test API endpoints with detailed logging

### How to Use

#### Step 1: Select Data Type
- Choose between "Companies" or "People" data types
- This determines the target table structure

#### Step 2: Upload File
- Drag and drop or click to select CSV/Excel files
- Supported formats: `.csv`, `.xlsx`, `.xls`
- File is automatically parsed and validated

#### Step 3: Preview Data
- Review the parsed data in the preview table
- Verify column mapping and data quality
- Check for any parsing errors

#### Step 4: Configure Ingestion
- API endpoint is pre-configured: `https://render-marketing-db.onrender.com`
- Target table is auto-set based on data type:
  - Companies → `company.marketing_company`
  - People → `people.marketing_people`

#### Step 5: Submit Data
- Click "Upload to Render" to send data
- Monitor progress with success/failure counts
- Review any errors in the results section

#### Step 6: Debug (Optional)
- Use "Test API Endpoints" for detailed debugging
- View comprehensive logs including network timing, headers, and error details

### Expected Data Formats

#### Company Data
```csv
company_name,domain,industry,employee_count,location
"Tech Corp","techcorp.com","Technology",150,"San Francisco"
"Marketing Inc","marketing.com","Marketing",50,"New York"
```

#### People Data
```csv
first_name,last_name,email,company,title
"John","Doe","john@techcorp.com","Tech Corp","Engineer"
"Jane","Smith","jane@marketing.com","Marketing Inc","Manager"
```

---

## 🔧 Repair

### Common Issues & Quick Fixes

#### File Upload Issues
- **Problem**: File not uploading
- **Solution**: Check file format (CSV/Excel only), file size (<10MB recommended)

#### Parsing Errors
- **Problem**: Data not displaying correctly
- **Solution**: Ensure proper CSV formatting, check for special characters, verify encoding (UTF-8)

#### API Connection Failures
- **Problem**: Upload fails immediately
- **Solution**: Check network connection, verify API endpoint is accessible

#### Data Validation Errors
- **Problem**: Some records fail to insert
- **Solution**: Review error messages, check data types, ensure required fields are present

### Emergency Repairs

#### Reset Application State
```javascript
// Clear local storage and refresh
localStorage.clear();
window.location.reload();
```

#### Manual API Test
Use the built-in API tester to diagnose connection issues:
1. Click "Test API Endpoints (Detailed)"
2. Review the comprehensive log output
3. Check for CORS, network, or server errors

---

## 🏗️ Build

### Prerequisites

- Node.js 18+ and npm
- Git for version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

No environment variables required - the application uses hardcoded API endpoints for simplicity.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment

Deploy via Lovable's built-in deployment:
1. Click "Publish" in the Lovable interface
2. Configure custom domain if needed (requires paid plan)

### Key Dependencies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **React Router**: Navigation
- **Papa Parse**: CSV parsing
- **xlsx**: Excel file handling
- **React Dropzone**: File upload interface

---

## 🔍 Troubleshoot

### Debugging Tools

#### Built-in API Tester
Location: Main page, "API Endpoint Tester & Debugger" section

Features:
- Basic connectivity testing
- Insert endpoint validation  
- Multiple endpoint discovery
- CORS preflight checking
- Detailed error logging with timestamps

#### Console Logs
Open browser developer tools (F12) to view:
- Network requests and responses
- JavaScript errors and warnings
- Performance metrics

### Common Error Scenarios

#### 1. CORS Errors
**Symptoms**: Requests blocked by browser
**Diagnosis**: Look for "Access-Control-Allow-Origin" errors
**Solutions**: 
- Server must include proper CORS headers
- Check API tester CORS section for details

#### 2. Network Timeouts
**Symptoms**: Requests hang or timeout
**Diagnosis**: Check API tester timing logs
**Solutions**:
- Verify Render service is running
- Check internet connection
- Consider file size limitations

#### 3. Data Format Issues
**Symptoms**: Parsing errors, empty previews
**Diagnosis**: Check file content and structure
**Solutions**:
- Validate CSV/Excel format
- Check for special characters
- Ensure proper encoding

#### 4. Authentication Errors
**Symptoms**: 401/403 HTTP status codes
**Diagnosis**: API returns unauthorized errors
**Solutions**:
- Verify API key if required
- Check endpoint permissions
- Review API documentation

### Advanced Debugging

#### Network Analysis
1. Open browser DevTools → Network tab
2. Upload file or test API
3. Review request/response details
4. Check status codes, headers, timing

#### API Response Analysis
```javascript
// Manual API test in browser console
fetch('https://render-marketing-db.onrender.com/insert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    records: [{ test: 'data' }],
    target_table: 'company.marketing_company'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 📚 Training

### Architecture Overview

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── FileDrop.tsx     # File upload interface
│   ├── RecordPreviewTable.tsx  # Data preview
│   ├── IngestionForm.tsx       # API submission form
│   └── ApiTester.tsx           # Debugging tool
├── pages/
│   ├── Index.tsx        # Main application page
│   └── NotFound.tsx     # 404 error page
├── utils/
│   ├── parseCsv.ts      # CSV parsing logic
│   └── uploadToRender.ts # API communication
└── hooks/               # Custom React hooks
```

### Key Components

#### FileDrop Component
- **Purpose**: Handle file upload and parsing
- **Key Features**: Drag & drop, file validation, CSV/Excel support
- **Props**: `onDataParsed` callback for parsed data

#### RecordPreviewTable Component  
- **Purpose**: Display parsed data in table format
- **Key Features**: Scrollable, responsive, row numbering
- **Props**: `records` array of data objects

#### IngestionForm Component
- **Purpose**: Configure and submit data to API
- **Key Features**: Endpoint configuration, progress tracking, error handling
- **Props**: `records` data array, `tableType` for target selection

#### ApiTester Component
- **Purpose**: Debug API connectivity and responses
- **Key Features**: Multiple test scenarios, detailed logging, CORS checking
- **Props**: None (self-contained)

### Data Flow

1. **File Upload** → FileDrop component processes file
2. **Parsing** → parseCsv utility converts to JSON objects
3. **Preview** → RecordPreviewTable displays data
4. **Validation** → IngestionForm validates before submission
5. **API Call** → uploadToRender utility sends to Render endpoint
6. **Response** → Results displayed with success/error counts

### API Integration

#### Render Endpoint
- **Base URL**: `https://render-marketing-db.onrender.com`
- **Insert Endpoint**: `POST /insert`
- **Expected Payload**:
```json
{
  "records": [
    { "field1": "value1", "field2": "value2" }
  ],
  "target_table": "company.marketing_company"
}
```

#### Response Format
```json
{
  "inserted": 10,
  "failed": 2,
  "schema_hash": "abc123",
  "source": "api",
  "errors": ["Error message 1", "Error message 2"]
}
```

### Development Guidelines

#### Adding New Features
1. Create focused, single-purpose components
2. Use TypeScript interfaces for data structures
3. Follow existing naming conventions
4. Add proper error handling and loading states

#### Styling Guidelines
- Use Tailwind CSS classes with semantic tokens
- Leverage shadcn/ui components for consistency
- Ensure responsive design across devices
- Follow existing component patterns

#### Testing Strategy
- Use built-in API tester for endpoint validation
- Test file upload with various formats and sizes
- Verify data parsing with edge cases
- Check responsive design on multiple screen sizes

### Customization Points

#### API Endpoints
Modify `src/utils/uploadToRender.ts` to change:
- Base URL
- Authentication headers
- Request format
- Error handling

#### Data Parsing
Extend `src/utils/parseCsv.ts` to:
- Add new file formats
- Implement custom validation
- Handle special data types
- Improve error reporting

#### UI Components
Customize `src/components/ui/` files to:
- Match brand styling
- Add new variants
- Improve accessibility
- Enhance user experience

---

## 📞 Support

For technical issues:
1. Use the built-in API tester for debugging
2. Check browser console for errors
3. Review this documentation's troubleshooting section
4. Contact development team with detailed error logs

For feature requests or enhancements, please provide:
- Clear description of desired functionality
- Use case examples
- Any relevant data formats or API specifications