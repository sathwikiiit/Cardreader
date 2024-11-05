interface LicenseInfo {
    driving_license_number: string;
    name: string;
    father_name: string;
    date_of_birth: string;
    address: string;
    issuing_authority: string;
    issue_date: string;
  }
  
  export function parseAndStructureLicenseInfo(ocrText: string): LicenseInfo {
    const lines = ocrText.split('\n').map(line => line.trim());
    
    const licenseInfo: LicenseInfo = {
      driving_license_number: '',
      name: '',
      father_name: '',
      date_of_birth: '',
      address: '',
      issuing_authority: '',
      issue_date: ''
    };
  
    // Helper function to clean text
    const cleanText = (text: string): string => {
      return text
        .replace(/[\\,\[\]\{\}]/g, '') // Remove special characters
        .replace(/[-_]{2,}/g, '') // Remove multiple dashes or underscores
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/^\s+|\s+$/g, '') // Trim leading and trailing whitespace
        .replace(/[^a-zA-Z0-9\s.,'-]/g, ''); // Remove non-alphanumeric characters except for specific ones
    };
  
    // Helper function to find a line containing a specific string
    const findLine = (searchString: string) => 
      lines.find(line => line.toLowerCase().includes(searchString.toLowerCase()));
  
    // Extract driving license number
    const dlNumberLine = lines.find(line => /TS\d+/.test(line));
    if (dlNumberLine) {
      const match = dlNumberLine.match(/TS\d+/);
      licenseInfo.driving_license_number = match ? match[0] : '';
    }
  
    // Extract name and father's name
    const dlNumberIndex = lines.findIndex(line => /TS\d+/.test(line));
    if (dlNumberIndex !== -1 && dlNumberIndex + 2 < lines.length) {
      licenseInfo.name = cleanText(lines[dlNumberIndex + 1]);
      licenseInfo.father_name = cleanText(lines[dlNumberIndex + 2]);
    }
  
    // Extract address
    const addressStartIndex = dlNumberIndex + 3;
    const addressEndIndex = lines.findIndex(line => 
      line.toLowerCase().includes('signature') || 
      line.toLowerCase().includes('issued on')
    );
  
    if (addressStartIndex < addressEndIndex) {
      licenseInfo.address = lines
        .slice(addressStartIndex, addressEndIndex)
        .map(cleanText)
        .filter(line => line.length > 0)
        .join(', ');
    }
  
    // Extract issuing authority and issue date
    const issuedOnLine = findLine('Issued On:');
    if (issuedOnLine) {
      // Extract issue date
      const dateMatch = issuedOnLine.match(/\d{1,2}[-/]?\d{1,2}[-/]?\d{4}/);
      if (dateMatch) {
        const dateStr = dateMatch[0];
        // Format date consistently
        licenseInfo.issue_date = dateStr.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
      }
  
      // Extract issuing authority
      const rtaMatch = issuedOnLine.match(/RTA-[A-Z\-]+/);
      if (rtaMatch) {
        licenseInfo.issuing_authority = rtaMatch[0];
      }
    }
  
    // Clean up the final results
    Object.keys(licenseInfo).forEach(key => {
      const value = licenseInfo[key as keyof LicenseInfo];
      if (typeof value === 'string') {
        licenseInfo[key as keyof LicenseInfo] = cleanText(value)
          .replace(/\s*,\s*$/, '') // Remove trailing commas
          .replace(/^[,\s]+/, ''); // Remove leading commas and spaces
      }
    });
  
    return licenseInfo;
  }
  
