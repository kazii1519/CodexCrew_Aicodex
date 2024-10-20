import os
import uuid
import urllib
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from flask import Flask, render_template, request
from keras.utils import load_img, img_to_array
from werkzeug.utils import secure_filename

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = keras.models.load_model(os.path.join(BASE_DIR, 'model.hdf5'))
ALLOWED_EXT = set(['jpg', 'jpeg', 'png', 'jfif'])

# Define classes
classes = ['Cyst', 'Normal', 'Stone', 'Tumor']

# Define the ImageDataGenerator for data augmentation
datagen = ImageDataGenerator(
    rotation_range=20,      # Randomly rotate images by 20 degrees
    width_shift_range=0.2,  # Randomly shift the image horizontally by 20%
    height_shift_range=0.2,  # Randomly shift the image vertically by 20%
    zoom_range=0.2,         # Randomly zoom into the image by 20%
    shear_range=0.2,        # Shear the image
    horizontal_flip=True,   # Randomly flip images horizontally
    fill_mode='nearest'     # Fill any missing pixels after augmentation
)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXT

# Predict function with augmentation applied


def predict(filename, model):
    # Load the image
    img = load_img(filename, target_size=(200, 200), color_mode='grayscale')
    img = img_to_array(img)
    # Reshape to (1, 200, 200, 1) for batch processing
    img = img.reshape((1,) + img.shape)
    img = img.astype('float32')
    img /= 255.0

    # Apply data augmentation (this generates augmented images)
    augmented_images = datagen.flow(img, batch_size=1)

    # Predict using augmented images (you can take one augmented image or multiple)
    augmented_img = next(augmented_images)[0]  # Get one augmented image

    result = model.predict(augmented_img.reshape(
        1, 200, 200, 1))  # Predict using augmented image
    dict_result = {}
    for i in range(4):
        dict_result[result[0][i]] = classes[i]
    res = result[0]
    res.sort()
    res = res[::-1]
    prob = res[:4]
    prob_result = []
    class_result = []
    for i in range(4):
        prob_result.append((prob[i] * 100).round(2))
        class_result.append(dict_result[prob[i]])
    return class_result, prob_result


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/success', methods=['GET', 'POST'])
def success():
    error = ''
    target_img = os.path.join(os.getcwd(), 'static/images')
    if request.method == 'POST':
        files = request.files.getlist('file')
        if files:
            predictions_list = []
            for file in files:
                if file and allowed_file(file.filename):
                    # Ensure file names are safe
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(target_img, filename))
                    img_path = os.path.join(target_img, filename)

                    # Call the predict function for each image
                    class_result, prob_result = predict(img_path, model)
                    predictions = {
                        "img": filename,
                        "class1": class_result[0],
                        "class2": class_result[1],
                        "class3": class_result[2],
                        "class4": class_result[3],
                        "prob1": prob_result[0],
                        "prob2": prob_result[1],
                        "prob3": prob_result[2],
                        "prob4": prob_result[3],
                    }
                    predictions_list.append(predictions)
                else:
                    error = "Please upload valid images of jpg, jpeg, and png extensions only"

            if not error:
                return render_template('success.html', predictions_list=predictions_list)
            else:
                return render_template('index.html', error=error)
        else:
            error = "No files uploaded."
            return render_template('index.html', error=error)
    else:
        return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
