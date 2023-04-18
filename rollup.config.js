import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import jsx from 'acorn-jsx';
import babel from '@rollup/plugin-babel';

const name = 'index';

const bundle = (config) => ({
    ...config,
    input: './packages/segment-next-js/index.ts',
    external: (id) => !/^[./]/.test(id),
});

const config = [
    bundle({
        acornInjectPlugins: [jsx()],
        plugins: [
            commonjs({
                include: 'node_modules/**',
            }),
            babel({
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                presets: ['@babel/preset-react'],
                babelHelpers: 'bundled',
            }),
            nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
            typescript(),
            esbuild(),
        ],
        output: [
            {
                file: `./dist/${name}.js`,
                format: 'es',
                sourcemap: true,
            },
            {
                file: `./dist/${name}.mjs`,
                format: 'es',
                sourcemap: true,
            },
        ],
    }),
];

export default config;
