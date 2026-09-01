---
title: "Rust Programming"
summary: "A systems language that guarantees memory safety without a garbage collector, through ownership and borrowing."
status: "Exploring"
tags: ["systems", "languages"]
---

Rust is a systems programming language that gives you low-level control and high performance while preventing whole classes of memory bugs at compile time, and it does this without a garbage collector.

## Why I'm digging in

- It offers the performance and control of C or C++ with memory safety enforced by the compiler.
- It is increasingly the language of modern infrastructure and ML tooling (tokenizers, candle, burn), so it pairs naturally with my systems and ML interests.

## What I want to understand

- Ownership, borrowing, and lifetimes, and how the borrow checker actually reasons about them.
- Why "fearless concurrency" falls out of the same rules that guarantee memory safety.
- Traits, enums, and pattern matching as the core of Rust's expressiveness.
- The ecosystem: cargo as the build and package tool, and where Rust shows up in ML and WebAssembly.

## Starting points

- "The Rust Programming Language" (the Book) and the Rustlings exercises.
- Building a small CLI with cargo to get the everyday workflow.
- Rewriting something I would normally write in C, and letting the compiler teach me.

## Notes

TOML - Tom's Obvious, Minimal Language (cargo's config language)

```
cargo init - for projects already created without cargo
cargo new - create proj
cargo build - to build project executable
cargo run - to build and run project executable
cargo check - build proj without making bin to check for errors
cargo build --release: compile with optimizations
```

variables in rust by default are immutable (value cannot be reassigned or changed), can add ``mut`` after let to make a variable mutable
```
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:4:5
  |
2 |     let x = 5;
  |         - first assignment to `x`
3 |     println!("the value of x is: {x}");
4 |     x = 6;
  |     ^^^^^ cannot assign twice to immutable variable
  |
help: consider making this binding mutable
  |
2 |     let mut x = 5;
  |         +++

For more information about this error, try `rustc --explain E0384`.
error: could not compile `variables` (bin "variables") due to 1 previous error
```

can also use constants (values bound to a name) which are **always immutable** and cannot be bypassed with ``mut``, and **must always annotate the type**, can only be set to a deterministic expression thus cannot be a result computed at runtime, for constants use all uppercase with underscores between words, cannot mutate a variables type only the value 

```
# example 

const SECONDS_IN_ONE_HOUR: u32 = 1 * 60 * 60;
```

shadowing lets you reinstantiate a variable instance (declare a new variable with the same name as an existing one, I just wanna jargon yap baha)
```
fn main() {
    let x = 5;

    let x = x + 1;

    {
        let x = x * 2;
        println!("The value of x in the inside scope {x}");
    }

    println!("The value of x outside the scope {x}");

    // This whill compile time error since cannot mutate a variables type only the value
    let mut spaces = "   ";
    spaces = spaces.len();
}
```

Rust is statically typed meaning all type must be declared at compile time 

signed int use ``i`` while unsigned use ``u``, can go 8-bit (u8 or i8)  to 128 (u128 or i128) and architecture dependent (usize or isize)

number literals that can be multiple numeric types allow a type suffix, such as 57u8 to designate the type. Literals can also use ``_`` as a visual separator so ``1_000`` equates to ``1000``

default to i32 and use ``isize/usize`` when indexing some sort of collection

```
// Must be declared as parse converts string to a numeric type
let guess: u32 = "42".parse().expect("Not a number!");
```

if integer overflow occurs, in debug mode rust has checks causing panic at runtime. ``panicking is when a program exits with an error``

in release mode rust dosent have these checks rust does ``twos complement wrapping`` in u8 256 will wrap to 0 and 257 to 1, no panic but unexpected behavior impacting the result

can use these techniques provided by std lib for primitive num types
- wrap in all modes with ``wrapping_* methods, such as wrapping_add
- return the ``None`` value if there is overflow with the ``checked_*`` methods
- return value and boolean indicating whether overflow occured with overflowing_* methods
- saturate at the value's min or max values with the ``saturating_*`` methods

two prims for floats ``f32`` and ``f64``, f64 is standard and all float types are signed

a char in rust is **4 bytes**

compound types: used to group values into one type, rust has 2 which are ``arrays`` and ``tuples``

tuples are fixed lengths and can group a variety of types, can access individual types in a tuple using . or declaring to separate variables,
empty tuple is called a ``unit`` written as just () as an empty value or empty return type

```
fn main() {
    let tup = (500, 6.4, 1);

    let (x, y, z) = tup;

    println!("The value of y is: {y}");
}

fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);

    let five_hundred = x.0;

    let six_point_four = x.1;

    let one = x.2;
}
```

```
// classic arrays on the stack, there are also vectors which shape can change and are dynamic as it is allocated on the heap
fn main() {
    let a = [1,2,3,4,5];
}

// declares type and allocates number of elements in the array
let a: [i32; 5] = [1,2,3,4,5];

// initalizes with same value of specified init value, and length of array
let a = [3; 5];

// equivalent 
let a = [3,3,3,3,3];

// to access an array
let a = [1,2,3,4,5]

let first = a[0];
let second = b[1];
```

some other capabilities and handling invalid array element access
```
use std::io; // brings in io module in local scope from std lib

// using pub fn run() to port the module to main as the bin compiles there
pub fn run() {
    let a = [1, 2, 3, 4, 5];

    println!("Please enter an array index.");

    let mut index = String::new(); // create empty memory container to store future input

    io::stdin() // creates handle to take input from user
        .read_line(&mut index) // reads the input appending to string buffer, in this case we are storing to the memory address of index
        .expect("Failed to read line"); // fails gracefully with error message 

    let index: usize = index
        .trim() // removes leading white space
        .parse() // converts string into num 
        .expect("Index entered was not a number");

    let element = a[index];

    println!("The value of the element at index {index} is: {element}");
}
```
