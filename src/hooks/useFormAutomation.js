// hooks/useFormAutomation.js

// NOTE: CHECK LEITSTELLE
import { useCallback } from "react";
import { loggingService } from "../services/loggingService";

export const useFormAutomation = (
  webviewRef,
  isWebviewReady,
  submission,
  delayMultiplier = 1 // default multiplier
) => {
  const baseDelay = 1000; // base delay of 1 second
  const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms * delayMultiplier));

  const waitForWebview = useCallback(() => {
    return new Promise((resolve) => {
      console.log("Waiting for webview... Current state:", isWebviewReady);
      if (isWebviewReady) {
        console.log("Webview is ready");
        resolve();
      } else {
        const checkWebview = setInterval(() => {
          console.log("Checking webview state:", isWebviewReady);
          if (isWebviewReady) {
            console.log("Webview became ready");
            clearInterval(checkWebview);
            resolve();
          }
        }, 100);
      }
    });
  }, [isWebviewReady]);

  const executeWithTimeout = useCallback(
    async (script, timeout = 5000) => {
      if (!webviewRef.current) return null;

      try {
        await waitForWebview();
        return await webviewRef.current.executeJavaScript(`
          Promise.race([
            (async () => { ${script} })(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), ${timeout})
            )
          ])
        `);
      } catch (error) {
        console.error("Script execution error:", error);
        throw error;
      }
    },
    [webviewRef, waitForWebview]
  );

  const clickStartButton = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const startButton = document.querySelector('button[name="start"]');
        if (startButton) {
          startButton.click();
          resolve('Start button clicked');
        } else {
          reject('Start button not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const clickDsgvoCheckbox = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const checkbox = document.querySelector('#dsgvo');
        if (checkbox) {
          checkbox.click();
          resolve('DSGVO checkbox clicked');
        } else {
          reject('DSGVO checkbox not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const clickWeiterButton = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        console.log('Looking for weiter button...');
        const weiterButton = document.querySelector('button[name="next"], button#next');
        console.log('Found button:', weiterButton);
        if (weiterButton) {
          console.log('Clicking weiter button...');
          weiterButton.click();
          resolve('Weiter button clicked');
        } else {
          console.log('No weiter button found');
          reject('Weiter button not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const clickAuthChoiceNone = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const authChoice = document.querySelector("div[id='authChoiceNONE'] > label > span");
        if (authChoice) {
          authChoice.click();
          resolve('Auth choice NONE clicked');
        } else {
          reject('Auth choice NONE not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const setAntragsberechtigt = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const select = document.querySelector('select[id="antragsberechtigt"]');
        if (select) {
          const valueMap = {
            "Unternehmen": "3",
            "Freiberuflich tätige Person": "2"
          };
          select.value = valueMap["${submission.antragstellende_person}"];
          select.dispatchEvent(new Event('change'));
          resolve('Antragsberechtigt set');
        } else {
          reject('Antragsberechtigt select not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setOrganisation = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#organisation');
        if (input) {
          input.value = "${submission.name_organisation}";
          input.dispatchEvent(new Event('change'));
          resolve('Organisation set');
        } else {
          reject('Organisation input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setAnrede = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const select = document.querySelector('select#anrede');
        if (select) {
          const valueMap = {
            "Herr": "HERR",
            "Frau": "FRAU",
            "Keine Angabe": "KEINE_ANGABE"
          };
          select.value = valueMap["${submission.anrede}"];
          select.dispatchEvent(new Event('change'));
          resolve('Anrede set');
        } else {
          reject('Anrede select not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setVorname = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#vorname');
        if (input) {
          input.value = "${submission.vorname}";
          input.dispatchEvent(new Event('change'));
          resolve('Vorname set');
        } else {
          reject('Vorname input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setNachname = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#nachname');
        if (input) {
          input.value = "${submission.nachname}";
          input.dispatchEvent(new Event('change'));
          resolve('Nachname set');
        } else {
          reject('Nachname input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setLand = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const select = document.querySelector('select#land');
        if (select) {
          select.value = "DE";  // Deutschland
          select.dispatchEvent(new Event('change'));
          resolve('Land set to Deutschland');
        } else {
          reject('Land select not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const setPlz = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#plz');
        if (input) {
          input.value = "${submission.plz}";
          input.dispatchEvent(new Event('change'));
          resolve('PLZ set');
        } else {
          reject('PLZ input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setOrt = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#ort');
        if (input) {
          input.value = "${submission.ort}";
          input.dispatchEvent(new Event('change'));
          resolve('Ort set');
        } else {
          reject('Ort input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setStrasse = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#strasse');
        if (input) {
          input.value = "${submission.strasse}";
          input.dispatchEvent(new Event('change'));
          resolve('Strasse set');
        } else {
          reject('Strasse input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setHausnummer = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#hnr');
        if (input) {
          input.value = "${submission.hausnummer}";
          input.dispatchEvent(new Event('change'));
          resolve('Hausnummer set');
        } else {
          reject('Hausnummer input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setTelefon = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const vorwahl = document.querySelector('input#telVorwahl');
        const nummer = document.querySelector('input#telNummer');
        if (vorwahl && nummer) {
          vorwahl.value = "${submission.tel_vorwahl}";
          nummer.value = "${submission.tel_nummer}";
          vorwahl.dispatchEvent(new Event('change'));
          nummer.dispatchEvent(new Event('change'));
          resolve('Telefon set');
        } else {
          reject('Telefon inputs not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setEmail = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const email = document.querySelector('input#email');
        const emailConfirm = document.querySelector('input#email2');
        if (email && emailConfirm) {
          email.value = "${submission.email}";
          emailConfirm.value = "${submission.email}";
          email.dispatchEvent(new Event('change'));
          emailConfirm.dispatchEvent(new Event('change'));
          resolve('Email set');
        } else {
          reject('Email inputs not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setLeitstelle = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const select = document.querySelector('select#id');
        if (select) {
          // Selecting Förderungsgesellschaft des BDS-DGV mbH
          select.value = "1047876";  // Correct ID for BDS
          select.dispatchEvent(new Event('change'));
          resolve('Leitstelle set to BDS');
        } else {
          reject('Leitstelle select not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const clickBafaId = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const radio = document.querySelector('input#anerkannt-1');
        if (radio) {
          radio.click();
          resolve('BAFA-ID radio clicked');
        } else {
          reject('BAFA-ID radio not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const setBafaId = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#bafaID');
        if (input) {
          input.value = "${submission.bafa_id}";
          input.dispatchEvent(new Event('change'));
          resolve('BAFA-ID set');
        } else {
          reject('BAFA-ID input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setBeraterVorname = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#vorname');
        if (input) {
          input.value = "${submission.berater_vorname}";
          input.dispatchEvent(new Event('change'));
          resolve('Berater vorname set');
        } else {
          reject('Berater vorname input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setBeraterNachname = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#nachname');
        if (input) {
          input.value = "${submission.berater_nachname}";
          input.dispatchEvent(new Event('change'));
          resolve('Berater nachname set');
        } else {
          reject('Berater nachname input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setBeratungsUnternehmen = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#unternehmen');
        if (input) {
          input.value = "${submission.name_organisation}";
          input.dispatchEvent(new Event('change'));
          resolve('Beratungsunternehmen set');
        } else {
          reject('Beratungsunternehmen input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setRechtsform = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const valueMap = {
          "natürliche Person": "1",
          "juristische Person": "2"
        };
        const radioValue = valueMap["${submission.rechtsform}"];
        const radio = document.querySelector(\`input[name="rechtsform"][value="\${radioValue}"]\`);
        if (radio) {
          radio.click();
          resolve('Rechtsform set');
        } else {
          reject('Rechtsform radio not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setVorsteuer = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const valueMap = {
          "ja": "1",
          "nein": "0",
          "teilweise": "2"
        };
        const radioValue = valueMap["${submission.vorsteuer.toLowerCase()}"];
        const radio = document.querySelector(\`input[name="vorsteuerabzugsberechtigt"][value="\${radioValue}"]\`);
        if (radio) {
          radio.click();
          resolve('Vorsteuer set');
        } else {
          reject('Vorsteuer radio not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setGruendungsdatum = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        console.log('Attempting to set Gründungsdatum...');
        const input = document.querySelector('input[name="gruendungsdatum"]');
        
        if (!input) {
          console.error('Input element not found');
          reject('Gründungsdatum input not found');
          return;
        }

        // Convert the ISO string to YYYY-MM-DD format
        const date = new Date("${submission.gruendungsdatum}");
        const formattedDate = date.toISOString().split('T')[0];
        
        console.log('Setting date to:', formattedDate);
        input.value = formattedDate;
        input.dispatchEvent(new Event('change'));
        resolve('Gründungsdatum set');
      });
    `),
    [executeWithTimeout, submission]
  );

  const setGeschaeftsgegenstand = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input[id="gegenstand"]');
        if (input) {
          input.value = "${submission.geschaeftsgegenstand}";
          input.dispatchEvent(new Event('change'));
          resolve('Geschäftsgegenstand set');
        } else {
          reject('Geschäftsgegenstand input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setWirtschaftszweig = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input[id="wirtschaftszweig"]');
        if (input) {
          input.value = "${submission.wz_nummer}";
          input.dispatchEvent(new Event('change'));
          resolve('Wirtschaftszweig set');
        } else {
          reject('Wirtschaftszweig input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setRechtsperson = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const valueMap = {
          "öffentlich-rechtlich": "1",
          "privat-rechtlich": "2"
        };
        const radioValue = valueMap["${submission.rechtsperson}"];
        const radio = document.querySelector(\`input[name="art"][value="\${radioValue}"]\`);
        if (radio) {
          radio.click();
          resolve('Rechtsperson type set');
        } else {
          reject('Rechtsperson radio not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const clickConfirmation = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const checkbox = document.querySelector('input#aggregatedBestaetigungen');
        if (checkbox) {
          checkbox.click();
          resolve('Confirmation checkbox clicked');
        } else {
          reject('Confirmation checkbox not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const setUnternehmenstyp = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const valueMap = {
          "eigenständiges Unternehmen": "1",
          "Partnerunternehmen": "2",
          "verbundenes Unternehmen": "3"
        };
        
        const unternehmenstyp = "${submission.unternehmenstyp}";
        const mappedValue = valueMap[unternehmenstyp];
        
        const radio = document.querySelector(\`input#unternehmenstyp-\${mappedValue}\`);
        
        if (radio) {
          radio.click();
          resolve('Unternehmenstyp set');
        } else {
          reject(\`Unternehmenstyp radio not found for value \${unternehmenstyp} (mapped: \${mappedValue})\`);
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setBeschaeftigte = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#beschaeftigte');
        if (input) {
          input.value = "${submission.anzahl_ma}";
          input.dispatchEvent(new Event('change'));
          resolve('Beschäftigte set');
        } else {
          reject('Beschäftigte input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const setUmsatz = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const input = document.querySelector('input#umsatz');
        if (input) {
          input.value = "${submission.umsatz}";
          input.dispatchEvent(new Event('change'));
          resolve('Umsatz set');
        } else {
          reject('Umsatz input not found');
        }
      });
    `),
    [executeWithTimeout, submission]
  );

  const clickAllConfirmationCheckboxes = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const checkboxes = document.querySelectorAll('input#persoenlich1, input#persoenlich2, input#bwa');
        if (checkboxes.length === 3) {
          checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
              checkbox.click();
            }
          });
          resolve('All confirmation checkboxes clicked');
        } else {
          reject(\`Not all confirmation checkboxes found (found \${checkboxes.length} of 3)\`);
        }
      });
    `),
    [executeWithTimeout]
  );

  const clickSubmitButton = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const submitButton = document.querySelector('button#send[name="next"]');
        if (submitButton) {
          submitButton.click();
          resolve('Submit button clicked');
        } else {
          reject('Submit button not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const downloadPDF = useCallback(
    () =>
      executeWithTimeout(`
      return new Promise((resolve, reject) => {
        const pdfLink = document.querySelector('a#submitFormLink');
        if (pdfLink) {
          // Create a click event that allows default behavior
          const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          
          // Dispatch the event and let the default handler work
          const success = pdfLink.dispatchEvent(event);
          
          if (success) {
            resolve('PDF download initiated');
          } else {
            reject('PDF download failed');
          }
        } else {
          reject('PDF download link not found');
        }
      });
    `),
    [executeWithTimeout]
  );

  const fillForm = useCallback(
    async (shouldSubmit = false) => {
      const sessionId = crypto.randomUUID();
      try {
        console.log("Starting fillForm with submission:", submission);
        await loggingService.logAction(sessionId, "FORM_FILL_START", "INFO", {
          submissionDetails: {
            antragstellende_person: submission.antragstellende_person,
            name_organisation: submission.name_organisation,
            email: submission.email,
            shouldSubmit: shouldSubmit,
            // Add any other relevant submission details you want to track
          }
        });

        await waitForWebview();
        console.log("Webview ready, clicking start button...");
        try {
          await clickStartButton();
        } catch (error) {
          await loggingService.logAction(
            sessionId,
            "START_BUTTON_ERROR",
            "ERROR",
            error
          );
          throw error;
        }

        await delay(baseDelay);
        console.log("Clicking Weiter button...");
        try {
          await clickWeiterButton();
        } catch (error) {
          await loggingService.logAction(
            sessionId,
            "WEITER_BUTTON_ERROR",
            "ERROR",
            error
          );
          throw error;
        }

        await delay(baseDelay);
        console.log("Clicking Auth Choice None...");
        await clickAuthChoiceNone();

        await delay(baseDelay);
        console.log("clicking weiter button");
        await clickWeiterButton();
        await delay(baseDelay);

        if (submission) {
          console.log("Setting Antragsberechtigt...");
          await setAntragsberechtigt();

          console.log("Setting Organisation...");
          await setOrganisation();

          console.log("Setting Anrede...");
          await setAnrede();

          console.log("Setting Vorname...");
          await setVorname();

          console.log("Setting Nachname...");
          await setNachname();

          console.log("Setting Land...");
          await setLand();

          console.log("Setting PLZ...");
          await setPlz();

          console.log("Setting Ort...");
          await setOrt();

          console.log("Setting Strasse...");
          await setStrasse();

          console.log("Setting Hausnummer...");
          await setHausnummer();

          console.log("Setting Telefon...");
          await setTelefon();

          console.log("Setting Email...");
          await setEmail();

          console.log("Clicking Weiter button...");
          await clickWeiterButton();
          await delay(baseDelay);

          console.log("Waiting for page transition...");
          await delay(baseDelay); // 1 second delay

          console.log("Clicking final Weiter button...");
          await clickWeiterButton();
          await delay(baseDelay);

          await delay(baseDelay);

          console.log("Setting Leitstelle...");
          await setLeitstelle();

          await delay(baseDelay);
          console.log("Clicking final Weiter button...");
          await clickWeiterButton();
          await delay(baseDelay);

          console.log("Clicking BAFA-ID radio...");
          await clickBafaId();

          console.log("Setting BAFA-ID...");
          await setBafaId();

          // console.log("Setting Beratungsunternehmen...");
          // await setBeratungsUnternehmen();

          console.log("Setting Berater Vorname...");
          await setBeraterVorname();

          console.log("Setting Berater Nachname...");
          await setBeraterNachname();

          //delay
          await delay(baseDelay);

          console.log("Clicking Weiter button...");
          await clickWeiterButton();
          await delay(baseDelay);

          //delay
          await delay(baseDelay);

          console.log("Setting Rechtsform...");
          await setRechtsform();

          if (submission.rechtsform === "juristische Person") {
            console.log("Setting Rechtsperson type...");
            await setRechtsperson();
          }

          console.log("Setting Vorsteuer...");
          await setVorsteuer();

          console.log("Setting Gründungsdatum...");
          console.log("submission.gruendungsdatum", submission.gruendungsdatum);

          await delay(baseDelay);
          await setGruendungsdatum();
          await delay(baseDelay);

          console.log("Setting Geschäftsgegenstand...");
          await setGeschaeftsgegenstand();

          console.log("Setting Wirtschaftszweig...");
          await setWirtschaftszweig();

          //delay
          await delay(baseDelay);

          console.log("Clicking Weiter button...");
          await clickWeiterButton();
          await delay(baseDelay);

          //delay
          await delay(baseDelay);

          console.log("Clicking confirmation checkbox...");
          await clickConfirmation();

          //delay
          await delay(baseDelay);

          console.log("Setting Unternehmenstyp...");
          await setUnternehmenstyp();

          console.log("Setting Beschäftigte...");
          await setBeschaeftigte();

          console.log("Setting Umsatz...");
          await setUmsatz();

          console.log("next");
          await clickWeiterButton();
          await delay(baseDelay);

          console.log("Clicking all confirmation checkboxes...");
          await clickAllConfirmationCheckboxes();

          console.log("Submitting form...");
          await clickWeiterButton();
          await delay(baseDelay);
          await clickWeiterButton();

          if (shouldSubmit) {
            console.log("Submitting form and downloading PDF...");
            await loggingService.logAction(
              sessionId,
              "FORM_SUBMIT_START",
              "INFO"
            );

            try {
              await delay(baseDelay * 2);
              await clickSubmitButton();
              await delay(baseDelay * 3);

              await loggingService.logAction(
                sessionId,
                "PDF_DOWNLOAD_START",
                "INFO"
              );
              await downloadPDF();

              await loggingService.logAction(
                sessionId,
                "FORM_SUBMIT_COMPLETE",
                "SUCCESS"
              );
              console.log("PDF download initiated");
            } catch (error) {
              await loggingService.logAction(
                sessionId,
                "FORM_SUBMIT_ERROR",
                "ERROR",
                error
              );
              throw error;
            }
          }
        }

        await loggingService.logAction(
          sessionId,
          "FORM_FILL_COMPLETE",
          "SUCCESS"
        );
      } catch (error) {
        console.error("Error filling form:", error);
        await loggingService.logAction(
          sessionId,
          shouldSubmit ? "FORM_SUBMIT_ERROR" : "FORM_FILL_ERROR",
          "ERROR",
          {
            message: error.message,
            stack: error.stack,
            step: error.step || "unknown",
            details: error.details || {},
          }
        );
        throw error; // Re-throw to allow parent components to handle the error
      }
    },
    [
      waitForWebview,
      clickStartButton,
      clickDsgvoCheckbox,
      clickWeiterButton,
      clickAuthChoiceNone,
      submission,
      setAntragsberechtigt,
      setOrganisation,
      setAnrede,
      setVorname,
      setNachname,
      setLand,
      setPlz,
      setOrt,
      setStrasse,
      setHausnummer,
      setTelefon,
      setEmail,
      setLeitstelle,
      clickBafaId,
      setBafaId,
      setBeratungsUnternehmen,
      setBeraterVorname,
      setBeraterNachname,
      setRechtsform,
      setVorsteuer,
      setGruendungsdatum,
      setGeschaeftsgegenstand,
      setWirtschaftszweig,
      setRechtsperson,
      setUnternehmenstyp,
      setBeschaeftigte,
      setUmsatz,
      clickConfirmation,
      delayMultiplier,
      clickSubmitButton,
      downloadPDF,
    ]
  );

  const debugDOM = useCallback(
    () =>
      executeWithTimeout(`
      const html = document.documentElement.outerHTML;
      console.log('Full HTML in webview:', html);
      return html;  // This will be logged in the main window's console
    `).then((html) => {
        console.log("Full HTML from webview:", html);
      }),
    [executeWithTimeout]
  );

  return {
    fillForm,
    debugDOM,
    setAntragsberechtigt,
    setOrganisation,
    setAnrede,
    setVorname,
    setNachname,
    setLand,
    setPlz,
    setOrt,
    setStrasse,
    setHausnummer,
    setTelefon,
    setEmail,
    setLeitstelle,
    clickBafaId,
    setBafaId,
    setBeratungsUnternehmen,
    setBeraterVorname,
    setBeraterNachname,
    setRechtsform,
    setVorsteuer,
    setGruendungsdatum,
    setGeschaeftsgegenstand,
    setWirtschaftszweig,
    setRechtsperson,
    setUnternehmenstyp,
    setBeschaeftigte,
    setUmsatz,
    clickConfirmation,
  };
};
