import { useState } from "react";
import emailjs from "emailjs-com";
import Head from "next/head";

export default function Home() {
  const [step, setStep] = useState("start");
  const [sector, setSector] = useState("");
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState({});
  const sectors = ["Groothandel & Distributie", "Andere / Algemeen"];

  const handleSectorSelect = (selectedSector) => {
    setSector(selectedSector);
    setStep("kpi");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateKPI = () => {
    let calc = {};
    if (sector === "Groothandel & Distributie") {
      const marge = ((formData.omzet - formData.kostprijs) / formData.omzet) * 100;
      const leverbetrouwbaarheid = (formData.opTijd / formData.totaalLeveringen) * 100;
      const stockrotatie = formData.verkocht / formData.voorrraad;
      calc = { 
        marge: marge.toFixed(2) + " %", 
        leverbetrouwbaarheid: leverbetrouwbaarheid.toFixed(2) + " %", 
        stockrotatie: stockrotatie.toFixed(2) 
      };
    } else if (sector === "Andere / Algemeen") {
      const facturatiegraad = (formData.factBinnen30 / formData.factTotaal) * 100;
      calc = { 
        facturatiegraad: facturatiegraad.toFixed(2) + " %", 
        manueleRegistraties: formData.manueleRegistraties, 
        dataBeschikbaarheid: formData.dataBeschikbaarheid + " %" 
      };
    }
    setResults(calc);
    setStep("results");
  };

  const sendEmail = () => {
    const templateParams = {
      sector: sector,
      company: formData.company || "",
      user_name: formData.name || "",
      user_email: formData.email || "",
      user_phone: formData.phone || "",
      results: JSON.stringify(results, null, 2),
      kpi1_access: formData.kpi1_access || "",
      kpi2_access: formData.kpi2_access || "",
      kpi3_access: formData.kpi3_access || "",
    };
    emailjs
      .send("service_sdzz11f", "template_guwz73d", templateParams, "-FsQ2G8CmhnyhIQZW")
      .then(() => {
        setStep("thankyou");
      })
      .catch((error) => console.error("Email error:", error));
  };

  // Styles based on Podds logo colors
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "30px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#0F3A4D",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    },
    header: {
      marginBottom: "40px",
      textAlign: "center"
    },
    logo: {
      width: "240px",
      height: "auto",
      margin: "0 auto 30px",
      display: "block"
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      marginBottom: "16px",
      color: "#0F3A4D"
    },
    subtitle: {
      fontSize: "20px",
      marginBottom: "30px",
      lineHeight: "1.5",
      fontWeight: "400"
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 4px 20px rgba(15, 58, 77, 0.1)",
      maxWidth: "600px",
      margin: "0 auto",
      width: "100%"
    },
    button: {
      backgroundColor: "#E7440D",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s",
      margin: "10px 5px"
    },
    buttonHover: {
      backgroundColor: "#C53C0D"
    },
    sectorButton: {
      backgroundColor: "#FFFFFF",
      color: "#0F3A4D",
      border: "2px solid #0F3A4D",
      borderRadius: "6px",
      padding: "12px 26px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      margin: "10px 5px",
      width: "250px",
      display: "inline-block"
    },
    sectorButtonHover: {
      backgroundColor: "#0F3A4D",
      color: "white"
    },
    formGroup: {
      marginBottom: "22px"
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginBottom: "5px"
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc"
    },
    results: {
      backgroundColor: "#F5F7F9",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "30px"
    },
    resultItem: {
      margin: "10px 0",
      fontSize: "18px",
      display: "flex",
      justifyContent: "space-between"
    },
    footer: {
      marginTop: "40px",
      textAlign: "center",
      fontSize: "14px",
      color: "#6B7280"
    },
    resultHeading: {
      color: "#E7440D",
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "15px"
    }
  };

  // Create the Podds logo as an SVG
  // This is based on the colors from the logo in the uploaded image
  const PoddsLogo = () => (
    <svg width="240" height="80" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 30H100V170H50V30Z" fill="#0F3A4D"/>
      <path d="M120 100C120 61.34 151.34 30 190 30H240C278.66 30 310 61.34 310 100C310 138.66 278.66 170 240 170H190C151.34 170 120 138.66 120 100Z" fill="#0F3A4D"/>
      <path d="M190 65H240C259.33 65 275 80.67 275 100C275 119.33 259.33 135 240 135H190C170.67 135 155 119.33 155 100C155 80.67 170.67 65 190 65Z" fill="white"/>
      <path d="M330 100C330 61.34 361.34 30 400 30H450C488.66 30 520 61.34 520 100C520 138.66 488.66 170 450 170H400C361.34 170 330 138.66 330 100Z" fill="#0F3A4D"/>
      <path d="M400 65H450C469.33 65 485 80.67 485 100C485 119.33 469.33 135 450 135H400C380.67 135 365 119.33 365 100C365 80.67 380.67 65 400 65Z" fill="white"/>
      <path d="M540 30C540 30 590 30 590 80V170H540V30Z" fill="#E7440D"/>
    </svg>
  );

  // Tagline SVG for the "Making digital Automation and AI accessible" text
  const TaglineSVG = () => (
    <svg width="600" height="40" viewBox="0 0 600 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="20" fontFamily="Poppins" fontSize="20" fontWeight="500" fill="#0F3A4D">Making</text>
      <text x="80" y="20" fontFamily="Poppins" fontSize="20" fontWeight="500" fill="#E7440D">digital Automation</text>
      <text x="300" y="20" fontFamily="Poppins" fontSize="20" fontWeight="500" fill="#0F3A4D">and</text>
      <text x="350" y="20" fontFamily="Poppins" fontSize="20" fontWeight="500" fill="#E7440D">AI</text>
      <text x="380" y="20" fontFamily="Poppins" fontSize="20" fontWeight="500" fill="#0F3A4D">accessible to every business</text>
    </svg>
  );

  // Main rendering
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div style={styles.container}>
        <div style={styles.header}>
          <PoddsLogo />
          <div style={{ marginTop: "10px" }}>
            <TaglineSVG />
          </div>
        </div>

        {step === "start" && (
          <div style={styles.card}>
            <h1 style={styles.title}>Hoe goed kent u uw kerncijfers?</h1>
            <p style={styles.subtitle}>
              Bereken uw belangrijkste KPI's per sector en ontdek hoe makkelijk deze inzichten bij u beschikbaar zijn.
            </p>
            <div style={{textAlign: "center", marginTop: "30px"}}>
              <button 
                style={styles.button}
                onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
                onClick={() => setStep("sector")}
              >
                Start de KPI-check
              </button>
            </div>
          </div>
        )}

        {step === "sector" && (
          <div style={styles.card}>
            <h2 style={{...styles.title, fontSize: "26px"}}>In welke sector is uw bedrijf actief?</h2>
            <div style={{textAlign: "center", marginTop: "30px"}}>
              {sectors.map((s) => (
                <button 
                  key={s} 
                  style={styles.sectorButton}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = styles.sectorButtonHover.backgroundColor;
                    e.target.style.color = styles.sectorButtonHover.color;
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = styles.sectorButton.backgroundColor;
                    e.target.style.color = styles.sectorButton.color;
                  }}
                  onClick={() => handleSectorSelect(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "kpi" && (
          <div style={styles.card}>
            <h2 style={{...styles.title, fontSize: "26px", marginBottom: "25px"}}>
              Sector: <span style={{color: "#E7440D"}}>{sector}</span>
            </h2>
            
            {sector === "Groothandel & Distributie" ? (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Omzet (€):</label>
                  <input 
                    name="omzet" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Kostprijs (€):</label>
                  <input 
                    name="kostprijs" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi1_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Aantal leveringen:</label>
                  <input 
                    name="totaalLeveringen" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Aantal op tijd geleverd:</label>
                  <input 
                    name="opTijd" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi2_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Verkochte aantallen:</label>
                  <input 
                    name="verkocht" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gemiddelde voorraad:</label>
                  <input 
                    name="voorrraad" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi3_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Totaal facturatiebedrag (€):</label>
                  <input 
                    name="factTotaal" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gefactureerd binnen 30 dagen (€):</label>
                  <input 
                    name="factBinnen30" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi1_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Manuele registraties per week:</label>
                  <input 
                    name="manueleRegistraties" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi2_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>% beschikbare data voor kernrapportage:</label>
                  <input 
                    name="dataBeschikbaarheid" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                    placeholder="%" 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi3_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
              </>
            )}
            
            <div style={{textAlign: "center", marginTop: "30px"}}>
              <button 
                onClick={calculateKPI} 
                style={styles.button}
                onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
              >
                Bekijk mijn resultaten
              </button>
            </div>
          </div>
        )}

        {step === "results" && (
          <div style={styles.card}>
            <h2 style={{...styles.title, fontSize: "26px", marginBottom: "25px"}}>Uw KPI Resultaten</h2>
            
            <div style={styles.results}>
              <h3 style={styles.resultHeading}>Berekende KPI's:</h3>
              {Object.entries(results).map(([key, value]) => (
                <div key={key} style={styles.resultItem}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            
            <h3 style={{...styles.title, fontSize: "22px", marginTop: "30px", marginBottom: "20px"}}>
              Ontvang uw resultaten per e-mail
            </h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Bedrijfsnaam:</label>
              <input name="company" style={styles.input} onChange={handleInputChange} />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Naam contactpersoon:</label>
              <input name="name" style={styles.input} onChange={handleInputChange} />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>E-mailadres:</label>
              <input name="email" type="email" style={styles.input} onChange={handleInputChange} />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Telefoonnummer (optioneel):</label>
              <input name="phone" style={styles.input} onChange={handleInputChange} />
            </div>
            
            <div style={{textAlign: "center", marginTop: "30px"}}>
              <button 
                onClick={sendEmail} 
                style={styles.button}
                onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
              >
                Verstuur mijn KPI-resultaten
              </button>
            </div>
          </div>
        )}

        {step === "thankyou" && (
          <div style={styles.card}>
            <div style={{textAlign: "center"}}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="40" fill="#E7440D" fillOpacity="0.1"/>
                <path d="M32 40L38 46L48 34" stroke="#E7440D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <h2 style={{...styles.title, fontSize: "26px", marginTop: "20px"}}>
                Bedankt voor het invullen!
              </h2>
              
              <p style={{fontSize: "18px", lineHeight: "1.6", marginTop: "20px"}}>
                U ontvangt uw resultaten binnenkort per e-mail. <br/>
                Wij nemen graag contact met u op om deze te bespreken.
              </p>
              
              <div style={{marginTop: "40px"}}>
                <a 
                  href="/"
                  style={{...styles.button, textDecoration: "none"}}
                  onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                  onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                  Terug naar begin
                </a>
              </div>
            </div>
          </div>
        )}
        
        <div style={styles.footer}>
          <p>© {new Date().getFullYear()} Podds - Making digital Automation and AI accessible to every business</p>
        </div>
      </div>
    </>
  );
}
