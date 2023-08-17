# markerless-ar: Markerless Augmented Reality Library for 3D Visualization

The **markerless-ar** library is a powerful JavaScript tool that enables developers to integrate markerless Augmented Reality (AR) experiences. With this library, you can take 3D object interaction to the next level, allowing users to translate and rotate GLTF objects using natural hand gestures.

## Key Features 🚀

- **Markerless:** Forget about the need for physical markers. The built-in hand tracking technology in the library provides a more immersive and natural AR experience.

- **Intuitive Interaction:** Users can interact with 3D objects intuitively using hand gestures such as translation and rotation, providing greater control and realism to the AR experience.

- **Compatibility:** The library utilizes A-Frame.js and Handsfree.js libraries for easy integration and a smooth development experience.

- **Performance Optimization:** Integration of DRACO enables efficient compression of GLTF models, ensuring smooth performance and quick loading even on resource-constrained devices.

## Getting Started 🛠️

You can download the project and run the index.html file to test the example. In test.js you will find an example of importing the necessary files to run it, and create two gltf objects in the scene. I suggest you to use the html file as a template, since misconfiguring it can affect how the example works.

## Documentation and Examples 📚

For detailed instructions on how to use handsfree.js, setup, and usage of the markerless-ar library, refer to the [complete documentation](https://handsfreejs.netlify.app/).

You may also want to check the [gltf-model for aframe](https://aframe.io/docs/1.4.0/components/gltf-model.html), and [how AR works with aframe](https://aframe.io/blog/arjs/).

## Contributions 👥

Contributions are welcome! If you'd like to enhance the library, add new features, or report issues, feel free to open an issue or submit a Pull Request.

## Credits and Acknowledgments 🙌

The markerless-ar library utilizes open-source technologies, including A-Frame.js and Handsfree.js. We appreciate the communities behind these libraries for their incredible work.  
The gltf models present in the examples folder are from the gltf-Sample-Models repository: [Box](https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/Box/glTF-Embedded), [DamagedHelmet](https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/DamagedHelmet/glTF-Embedded).

## License 📜

This library is distributed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
