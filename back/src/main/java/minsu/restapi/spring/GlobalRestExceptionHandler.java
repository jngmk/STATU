package minsu.restapi.spring;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/*
인터셉터에서 전달된 예외를 처리할 ControllerAdvice.
 */
@RestControllerAdvice
public class GlobalRestExceptionHandler {

    @ExceptionHandler(value = { RuntimeException.class })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> internalServerError(Exception e){
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("msg", e.getMessage());
        return resultMap;
    }
}
