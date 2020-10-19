﻿
function validerLikeStasjoner() {

    const start = document.getElementById("startstasjonAdmin").value;
    const slutt = document.getElementById("endestasjonAdmin").value;

    if (start === slutt) {
        $("#feilStartStasjonAdmin").html("Stasjonsnavnene kan ikke være like. ")
        $("#feilEndeStasjonAdmin").html("Stasjonsnavnene kan ikke være like. ")
        return false;
    }
    else {
        return true;
    }
}

function validerOgLagTur() {
    const StartstasjonOK = validerStartStasjonAdmin($("#startstasjonAdmin").val());
    const EndestasjonOK = validerEndeStasjonAdmin($("#endestasjonAdmin").val());
    const ikkeLikeStasjoner = validerLikeStasjoner();
    const DatoOK = validerDatoAdmin($("#datoAdmin").val());
    const TidOK = validerTidAdmin($("#tidAdmin").val());
    const BarnePrisOK = validerBarnePrisAdmin($("#barnePrisAdmin").val());
    const VoksenPrisOK = validerVoksenPrisAdmin($("#voksenPrisAdmin").val());
    if (StartstasjonOK && EndestasjonOK && ikkeLikeStasjoner && DatoOK && TidOK && BarnePrisOK && VoksenPrisOK) {
        opprettTur();
    }
}

function testFunction() {
    onChange();
    validerStartStasjonAdmin($("#startstasjonAdmin").val());
    validerEndeStasjonAdmin($("#endestasjonAdmin").val());
    validerLikeStasjoner();
}


function opprettTur() {

    const tur = {
        startstasjon: $("#startstasjonAdmin").val(),
        endestasjon: $("#endestasjonAdmin").val(),
        dato: $("#datoAdmin").val(),
        tid: $("#tidAdmin").val(),
        barnepris: $("#barnePrisAdmin").val(),
        voksenpris: $("#voksenPrisAdmin").val()
    }

    const url = "bestilling/opprettTur";
    $.post(url, tur, function () {
        window.location.href = 'admin.html';
        console.log("Tur er opprettet!");
    })
        .fail(function () {
            $("#feil").html("Feil på server - prøv igjen senere");
        });
};

