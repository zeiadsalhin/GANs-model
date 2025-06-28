import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Layer

# Define the custom SubpixelConv2D layer
class SubpixelConv2D(Layer):
    def __init__(self, upsampling_factor=2, **kwargs):
        super(SubpixelConv2D, self).__init__(**kwargs)
        self.upsampling_factor = upsampling_factor

    def call(self, inputs):
        return tf.nn.depth_to_space(inputs, self.upsampling_factor)

    def get_config(self):
        config = super().get_config()
        config.update({'upsampling_factor': self.upsampling_factor})
        return config

# Load the model
def load_model():
    model = tf.keras.models.load_model(
        r"C:\Users\zeyad\Desktop\tailwind\react\gans-model\generator_model_V5.h5",
        custom_objects={'SubpixelConv2D': SubpixelConv2D}
    )
    return model

# Preprocess input image: resize and convert to float32
def preprocess(img_path):
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (64, 64))
    img = img.astype(np.float32)
    return np.expand_dims(img, axis=0)

# Postprocess output image: clip and convert to uint8
def postprocess(output):
    img = np.clip(output[0], 0, 255).astype(np.uint8)
    return img

# Perform upsampling using the model
def upsample_image(input_path, model):
    img = preprocess(input_path)
    sr_img = model.predict(img)
    sr_img = postprocess(sr_img)

    # Convert RGB back to BGR for saving with OpenCV
    sr_img_bgr = cv2.cvtColor(sr_img, cv2.COLOR_RGB2BGR)
    out_path = input_path.replace(".png", "_sr.png")
    cv2.imwrite(out_path, sr_img_bgr)
    return out_path
