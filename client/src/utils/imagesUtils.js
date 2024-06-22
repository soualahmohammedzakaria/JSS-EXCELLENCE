export const isImage = (file) => { // Fonction pour vérifier si le fichier est une image
    return file.type.startsWith('image/');
};