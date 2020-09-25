﻿$(function () {
    HentAlleStasjoner();
});

function HentAlleStasjoner() {
    $.get("bestilling/hentAlleStasjoner", function (stasjoner) {
        if (stasjoner) {
            listStartStasjoner(stasjoner);
        } else {
            $("#feil").html("Feil i db");
        }
    });
}

function listStartStasjoner(stasjoner) {
    let ut = "<select onchange='listEndeStasjoner()' id='startstasjon'>";
    ut += "<option>Velg startstasjon</option>";
    for (let stasjon of stasjoner) {
        ut += "<option>" + stasjon.stasjonsNavn + "</option>";
    }
    ut += "</select>";
    $("#startstasjon").html(ut);
    console.log(JSON.stringify(stasjoner));
}

function listEndeStasjoner() {
    let startstasjon = $('#startstasjon option:selected').val();
    console.log("StartStasjon: " + startstasjon);
    const url = "bestilling/hentEndeStasjoner?startStasjonsNavn=" + startstasjon;
    $.get(url, function (stasjoner) {
        if (stasjoner) {
            let ut = "<label>Jeg skal reise til</label>";
            ut += "<select onchange='listDato()'>";
            ut += "<option></option>";
            let forrigeStasjon = "";
            for (let stasjon of stasjoner) {
                if (stasjon.stasjonsNavn !== forrigeStasjon) {
                    ut += "<option>" + stasjon.stasjonsNavn + "</option>";
                }
                forrigeStasjon = stasjon.stasjonsNavn;
            }
            ut += "</select>";
            $("#endestasjon").html(ut);
            console.log(JSON.stringify(stasjoner));
        } else {
            $("#feil").html("Feil i db");
        }
    });
}

function listDato() {
    let ut = "<label>Velg dato<span> (DD/MM/ÅÅÅÅ) </span></label>";
    ut += "<input type='text' id='datoValgt' onchange='listTidspunkt()'>";
    $("#dato").html(ut); 
}

function listTidspunkt() {
    let dato = $('#datoValgt').val();
    let startstasjon = $('#startstasjon option:selected').val();
    let endestasjon = $('#endestasjon option:selected').val();
    console.log("Dato: " + dato + ", startstasjon: " + startstasjon + ", endestasjon: " + endestasjon);
    const url = "bestilling/hentAlleTurer";
    $.get(url, function (turer) {
        if (turer) {
            let ut = "<label>Velg tidspunkt</label>";
            ut += "<select id='tidspunkt'>";
            for (let tur of turer) {
                console.log("Utenfor if, tur sin tid:" + tur.tid);
                if (startstasjon === tur.startStasjon.stasjonsNavn && endestasjon === tur.endeStasjon.stasjonsNavn && dato === tur.dato) {
                    ut += "<option>" + tur.tid + "</option>";
                    console.log("Tur sin tid:" + tur.tid);
                }
            }
            ut += "</select>";
            $("#tid").html(ut);
            console.log(JSON.stringify(turer));
        }
        else {
            $("#feil").html("Feil i db");
        }
    });
}

function beregnPris() {
    let dato = $('#datoValgt').val();
    let startstasjon = $('#startstasjon option:selected').val();
    let endestasjon = $('#endestasjon option:selected').val();
    let tid = $('#tid option:selected').val();
    let antallBarn = $("#antallBarn").val();
    let antallVoksne = $("#antallVoksne").val();

    let pris;
    let barnepris = 0;
    let voksenpris = 0;

    const url = "bestilling/hentAlleTurer";
    $.get(url, function (turer) {
        if (turer) {
            for (let tur of turer) {
                if (startstasjon === tur.startStasjon.stasjonsNavn && endestasjon === tur.endeStasjon.stasjonsNavn && dato === tur.dato && tid == tur.tid) {
                    console.log("tur.barnepris: " + tur.barnePris + ", antallBarn: " + antallBarn + ", tur.voksenPris: " + tur.voksenPris + ", antallVoksne: " + antallVoksne);
                    barnepris = tur.barnePris;
                    voksenpris = tur.voksenPris;
                }
            }
            if (antallBarn > 0 && antallVoksne > 0) {
                pris = (barnepris * antallBarn) + (voksenpris * antallVoksne);
            }
            else if (antallBarn <= 0 && antallVoksne > 0) {
                pris = voksenpris * antallVoksne;
            }
            else if (antallVoksne <= 0 && antallBarn > 0) {
                pris = barnepris * antallBarn;
            }
            else {
                pris = 0;
            }
            console.log("Beregnet pris: " + pris);
        }
        else {
            $("#feil").html("Feil i db");
        }
    });
}

function beregnOgValiderBarn() {
    let antallBarn = $("#antallBarn").val();
    validerAntallBarn(antallBarn);
    beregnPris();
}

function beregnOgValiderVoksen() {
    let antallVoksne = $("#antallVoksne").val();
    validerAntallBarn(antallVoksne);
    beregnPris();
}

function validerOgLagBestilling() {
    const StartstasjonOK = validerStartstasjon($("#startstasjon").val());
    //const EndestasjonOK = validerEndestasjon($("#endestasjon").val());
    const FornavnOK = validerFornavn($("#fornavn").val());
    const EtternavnOK = validerEtternavn($("#etternavn").val());
    const TelefonnummerOK = validerTelefonnummer($("#telefonnr").val());
    const AntallBarnOK = validerAntallBarn($("#antallBarn").val());
    const AntallVoksneOK = validerAntallVoksne($("#antallVoksne").val());
    if (StartstasjonOK && FornavnOK && EtternavnOK && TelefonnummerOK && AntallBarnOK && AntallVoksneOK) {
        lagreBestilling();
    }
}

function lagreBestilling() {
    var totalPris = beregnPris();
    console.log("Totalpris: " + totalPris);

    const bestilling = {
        fornavn: $("#fornavn").val(),
        etternavn: $("#etternavn").val(),
        telefonnummer: $("#telefonnr").val(),
        antallBarn: $("#antallBarn").val(),
        antallVoksne: $("#antallVoksne").val(),
        totalPris: totalPris,
        startstasjon: $("#startstasjon option:selected").val(),
        endeStasjon: $("#endestasjon option:selected").val(),
        dato: $("#datoValgt").val(),
        tid: $("#tid option:selected").val()

        //console.log("barn: " + antallBarn + ", voksne: " + antallVoksne + ", totalpris: " + totalPris);

    }
    const url = "bestilling/lagre";
    $.post(url, bestilling, function () {
        window.location.href = 'index.html';
        console.log("Bestillingen er lagret!");
    })
        .fail(function () {
            $("#feil").html("Feil på server - prøv igjen senere");
        });
};

/*
function lagreBestilling() {
    const bestilling = {
        fornavn: $("#fornavn").val(),
        etternavn: $("#etternavn").val(),
        telefonnummer: $("#telefonnr").val(),
        antallBarn: $("#antallBarn").val(),
        antallVoksne: $("#antallVoksne").val(),
        totalPris: $("#totalPris").val(),
        startstasjon: $("#startstasjon option:selected").val(),
        endeStasjon: $("#endestasjon option:selected").val(),
        dato: $("#datoValgt").val(),
        tid: $("#tid option:selected").val()

    }
    const url = "bestilling/lagre";
    $.post(url, bestilling, function () {
        window.location.href = 'index.html';
        console.log("Bestillingen er lagret!");
    })
        .fail(function () {
            $("#feil").html("Feil på server - prøv igjen senere");
        });
};
*/

