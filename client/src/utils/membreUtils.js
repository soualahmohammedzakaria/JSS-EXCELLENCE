export const extraireIdMembre = (ScanCodeQR) => {
    const parts = ScanCodeQR.split("_");
    if (parts.length !== 3) {
        return false;
    }
    if (isNaN(parseInt(parts[2]))) {
        return false;
    }
    return parseInt(parseInt(parts[2]));
};