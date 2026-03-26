/*
 * Copyright 2025 DataRobot, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/block/theme-toggle';
import { Button } from '@/components/ui/button';
import reactLogo from './assets/react.svg';
import viteLogo from '/assets/vite.svg';

function App() {
    const [count, setCount] = useState(0);
    const [welcome, setWelcome] = useState('Loading...');

    const fetchWelcome = async () => {
        const response = await fetch('./api/v1/welcome');
        const data = await response.json();
        setWelcome(data.message);
    };
    useEffect(() => {
        fetchWelcome();
    }, []);

    return (
        <>
            <header className="flex justify-end p-4">
                <ThemeToggle />
            </header>
            <div className="mx-auto max-w-5xl p-8 text-center">
                <div className="flex items-center justify-center gap-8">
                    <a href="https://vite.dev" target="_blank">
                        <img
                            src={viteLogo}
                            className="h-24 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
                            alt="Vite logo"
                        />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img
                            src={reactLogo}
                            className="h-24 animate-spin p-6 transition-[filter] duration-300 [animation-duration:20s] hover:drop-shadow-[0_0_2em_#61dafbaa]"
                            alt="React logo"
                        />
                    </a>
                </div>
                <h1 className="heading-01 my-4">Vite + React: {welcome}</h1>
                <div className="p-8">
                    <Button onClick={() => setCount(count => count + 1)}>count is {count}</Button>
                    <p className="mt-4">
                        Edit <code className="code">src/App.tsx</code> and save to test HMR
                    </p>
                </div>
                <p className="body-secondary">Click on the Vite and React logos to learn more</p>
            </div>
        </>
    );
}

export default App;
