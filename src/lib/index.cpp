// core
#include <array>
// dependencies
#include <emscripten.h>  // WebAssembly compiler

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE double add(const double a, const double b) {
  return a + b;
}

#ifdef __cplusplus
}
#endif