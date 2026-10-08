package ai_codebase_assistence.server.services;

import ai_codebase_assistence.server.entity.User;
import ai_codebase_assistence.server.exceptions.NotFoundException;
import ai_codebase_assistence.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    public final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User requireById(UUID id){
        return userRepository.findById(id).orElseThrow(()->new NotFoundException("User not found"));
    }



    public static Long toLong(Object value){
        if(value instanceof Number number){
            return number.longValue();
        }
        return Long.parseLong(String.valueOf(value));
    }
}
