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
        config = super(SubpixelConv2D, self).get_config()
        config.update({'upsampling_factor': self.upsampling_factor})
        return config

# Load model with custom layer
def load_model():
    model = tf.keras.models.load_model(
        r"C:\Users\omarh\Documents\College\Year 4 Term 2\Final-Year-Project\Server\generator_init.h5",
        custom_objects={'SubpixelConv2D': SubpixelConv2D}
    )
    return model

# Preprocess input image
def preprocess(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (64, 64))  # Resize to 64x64 as expected by the model
    img = img / 127.5 - 1  # Normalize to [-1, 1]
    return np.expand_dims(img, axis=0)


# Postprocess output image
def postprocess(output):
    img = (output[0] + 1) * 127.5  # Scale back to [0, 255]
    return np.clip(img, 0, 255).astype(np.uint8)

# Apply super-resolution using the loaded model
def upsample_image(input_path, model):
    img = preprocess(input_path)
    sr_img = model.predict(img)
    sr_img = postprocess(sr_img)

    out_path = input_path.replace(".png", "_sr.png")
    cv2.imwrite(out_path, sr_img)
    return out_path
